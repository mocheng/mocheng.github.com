YUI.add('carousel', function(Y) {

var FLICK_MIN_DISTANCE = 15;

Y.Carousel = Y.Base.create('carousel', Y.Widget, [],
{
    initializer: function() {
        this.cb = this.get('contentBox');
    },

    destructor: function() {
    },

    renderUI: function() {
        //var list = this.list = this.cb.one('ul:first-child'), count;
        //

        this.cb.setStyles({
            width: this.get('width'),
            height: this.get('height')
        });

        this.fan = this.cb.one('ul.yui3-carousel-fan');
        this.fan.setStyles({
            height: this.get('rotateRadius')
        });

        this.fanBlocks = this.fan.get('children').filter('li');
        this.fanBlocks.setStyles({
            height: this.get('rotateRadius')
        });

        var count = this._fanCount = this.fanBlocks.size();
        var rotateDegree = this.get('rotateDegree');

        this._headIndex = Math.floor((count+1)/2) - 1;
        this._tailIndex = this._headIndex + 1;

        this.fanBlocks.each(function(node, idx) {
            var ang, zIndex;
            if (idx < count/2) {
                ang = idx * rotateDegree;
            } else {
                ang = - (count- idx) * rotateDegree;
            }

            zIndex = 100 - idx;

            node.setData('rotate', ang);
            //node.setData('index', idx);
            node.setStyles({
                '-webkit-transform' : 'rotate(' + ang + 'deg)',
                'z-index' : zIndex
            });
        }, this);

    },

    bindUI: function() {
        this.cb.on('flick', function(e) {
            if (e.flick.distance < 0) {
                this.prev();
            } else {
                this.next();
            }
        },
        {
            minDistance: FLICK_MIN_DISTANCE,
            axis: 'x',
            minVelocity: 0,
            preventDefault: true
        }, this);
    },

    next: function() {
        this.rotate(this.get('rotateDegree'));
    },

    prev: function() {
        this.rotate(- this.get('rotateDegree'));
    },

    rotate: function(degree) {
        var that = this;

        if (this.rotating) {
            return;
        }
        this.rotating = true;

        this.rotationAng = this.rotationAng || 0;
        this.rotationAng += degree;

        this.fan.setStyles({
                '-webkit-transform' : 'translate3d(0,0,0) rotate(' + this.rotationAng + 'deg)'
        });
        this.fan.once('webkitTransitionEnd', function(e) {
            that._switchFan(degree>0);
            that.rotating = false;
        });

        /*
        this.fan.transition({
            'duration' : this.get('rotateDuration'),
            'easing' : 'ease-out',
            'transform': 'rotate(' + this.rotationAng + 'deg)'
        }, function() {
            that._switchFan(degree>0);
            that.rotating = false;
        });
        */
    },

    _switchFan: function(clockwise) {
        var movingFan, rotate, stepIndex,
            edgeDegree = this._fanCount * this.get('rotateDegree');

        if (clockwise) {
            movingFan = this.fanBlocks.item(this._headIndex); //moving head fan
            rotate = movingFan.getData('rotate');
            rotate -= edgeDegree;
            stepIndex = -1;
        } else {
            movingFan = this.fanBlocks.item(this._tailIndex); //moving tail fan
            rotate = movingFan.getData('rotate');
            rotate += edgeDegree;
            stepIndex = 1;
        }

        movingFan.setData('rotate', rotate);
        movingFan.setStyles({
            '-webkit-transform' : 'rotate(' + rotate + 'deg)'
        });

        this._headIndex = (this._headIndex + stepIndex + this._fanCount ) % this._fanCount;
        this._tailIndex = (this._tailIndex + stepIndex + this._fanCount ) % this._fanCount;

        Y.log('head index:' + this._headIndex);
        Y.log('tail index:' + this._tailIndex);
    }

},
{
    NAME: 'carousel',
    ATTRS: {
        rotateDuration: {
            value:  0.25
        },
        rotateRadius: {
            value: 3000
        },
        rotateDegree : {
            value: 5
        },
        width: {
            value: 1024
        },
        height: {
            value: 800
        }

    }
});

},
'0.0.1',
{
    requires: ['base', 'widget', 'node', 'event-flick', 'transition']
});
