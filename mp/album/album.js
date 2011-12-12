YUI.add('album', function(Y) {

var FLICK_MIN_DISTANCE = 15;

//
// Y.Album represents card-fold
//
Y.Album = Y.Base.create('album', Y.Widget, [],
{
    initializer: function() {
        this.cb = this.get('contentBox');
        this.coverList = this.cb.one('.cover-list');
        this.cardFolds = this.cb.all('.card-fold');
        this.covers = this.cb.all('.card-mock');   //do not use card-mock in practise
        this.bg = this.cb.one('.fold-background');
        this.flicker = this.cb.one('.flicker');
        this.flickerBar = this.flicker.one('.flicker-bar')

        this.originAlbumX = this.coverList.getX()+7;
        this.originBarX = 380;  //hardcode for the time being

        this.drager = new Y.DD.Drag({
            node: this.flickerBar
        }).plug(Y.Plugin.DDConstrained, {
            constrain2node: '.flicker'
        });
    },

    destructor: function() {
    },

    renderUI: function() {
        this.cardWidth = parseInt(this.cardFolds.item(0).getComputedStyle('width'));
        this.cardHeight = parseInt(this.cardFolds.item(0).getComputedStyle('height'));

        this.cb.setStyle('height', this.cardHeight);

        this.collapse();
    },

    bindUI: function() {
        this.cb.on('flick', function(e) {
            var offsetX = 0,
                endTarget = e.target,
                distance = e.flick.distance;

            if(this.cb.all('.unfolded').size()!=0) {
                return;
            }

            if (this._collpased && distance > 0) {
                this.expand();
            }
            if (!this._collpased && distance < 0) {
                this.collapse();
            }
        }, {
            minDistance: FLICK_MIN_DISTANCE,
            axis: 'x',
            //preventDefault: true, // Wired, if preventDefault, 'click' delegate below would not trigger in iPad
            minVelocity: 0,
        }, this);


        if ('ontouchstart' in document) {
            this.cb.delegate('touchend', this._onClickCard, '.card-fold', this);
        } else {
            this.cb.delegate('click', this._onClickCard, '.card-fold', this);
        }

        this.drager.on('drag:drag', function(e){
            var axisX = this.flickerBar.getX(),
                distance = axisX - this.originBarX,
                albumWidth = (this.cardWidth)*3;

            this.coverList.setX(-albumWidth*distance/250+this.originAlbumX);
        }, this);

        document.ontouchmove = function(e) {e.preventDefault()};
    },

    _onClickCard: function(e) {
        var currTarget = e.currentTarget;
        if (!this._collpased) {
            if (currTarget.hasClass('unfolded')) {
                this.fold(currTarget);
            } else {
                this.unfold(currTarget);
            }
        }
    },

    unfold: function(cardFold) {

        if (cardFold.getData('folding')) {
            return;
        }
        cardFold.setData('folding', true);

        cardFold.removeClass('folded');
        cardFold.addClass('unfolded');

        var cards = cardFold.all('.inner');
        //this._rotate(cards);
        //this.rotate(cardFold);

        cardFold.setData('folding', false);

        if(cards.size()==0) {
            return;
        }

        cards.each(function(node, idx, list) {
            node.setStyle('background', '#000');
        }, this);

        this.covers.each(function(node, idx, list) {
            node.setStyles({
                '-webkit-transition': '1s ease-out', // TODO: make this mess clearer
                '-webkit-transform': 'translate(' + 2*this.cardWidth +'px, 0)',
            });


        }, this);
        this.bg.setStyle('display', 'block');

    },

    fold: function(cardFold) {
        if (cardFold.getData('folding')) {
            return;
        }
        cardFold.setData('folding', true);

        cardFold.removeClass('unfolded');
        cardFold.addClass('folded');

        var cards = cardFold.all('.inner');

        //this._rotate(cards);
        //this.rotate(cardFold);
        setTimeout(function(){
            cards.each(function(node, idx, list) {
                node.setStyle('background', 'none');
            }, this);
        }, 1000);

        cardFold.setData('folding', false);

        this.covers.each(function(node, idx, list) {
            node.setStyles({
                '-webkit-transition': '1s ease-out', // TODO: make this mess clearer
                '-webkit-transform': 'translate(0px, 0)',
            });
        }, this);
        this.bg.setStyle('display', 'none');
    },

    rotate: function(cardFold) {
        cardFold.addClass('unfolded');
    },

    expand: function() {
        this.collapse(true);
    },

    collapse: function(expand) {
        var contentBox = this.get('contentBox'),
            offsetX = 0;

        var cards = contentBox.all('.card-fold'),
            display = expand ? 'block' : 'none';
        nodeCount = cards.size();

        cards.each(function(node, idx, list) {
            node.setStyles({
                '-webkit-transition': '0.55s ease-out', // TODO: make this mess clearer
                '-webkit-transform': 'translate(' + offsetX +'px, 0)',
                position: 'absolute',
                'z-index': nodeCount - idx,
            });

            offsetX += expand ? this.get('unfoldedDistance') : this.get('foldedDistance');
        }, this);

        this._collpased = !expand;

        this.flicker.setStyle('display', display);
    }

},
{
    NAME: 'album',
    ATTRS: {
        unfoldDuration: {
            value: 0.5
        },
        unfoldedDistance: {
            value: 337
        },
        foldedDistance: {
            value: 124
        }
    }
});

},
'0.0.1',
{
    requires: ['base', 'widget', 'node', 'event-flick', 'transition', 'dd-drag', 'dd-constrain']
});
