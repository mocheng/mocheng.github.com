YUI.add('flipview', function(Y) {
var FLICK_MIN_DISTANCE = 15;

Y.FlipView = Y.Base.create('flipview', Y.Widget, [],
{
    initializer: function() {
        this.cb = this.get('contentBox');
    },

    destructor: function() {
    },

    renderUI: function() {
        //var list = this.list = this.cb.one('ul:first-child'), count;
        var count;

        this.pages = this.cb.get('children').filter('.page');

        this.pageWidth = parseInt(this.pages.item(0).getComputedStyle('width'));
        this.pageHeight = parseInt(this.pages.item(0).getComputedStyle('height'));
        this.cb.setStyles({
            width: this.pageWidth,
            height: this.pageHeight
        });

        count = this.pages.size();
        this.pages.each(function(node, idx) {
            //node.setStyles({'z-index' : count - idx});
            if (idx != 0) {
                node.addClass('hidden');
            }
        }, this);

        this.currPageIdx = 0;
    },

    bindUI: function() {
        this.cb.on('flick', function(e) {
            if (e.flick.distance < 0) {
                this.next();
            } else {
                this.prev();
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
        var oldPage, oldPageClone, newPage, newPageClone, shadowSamuri1, shadowSamuri2, that = this; 

        if (this.currPageIdx < this.pages.size() - 1) {
            oldPage = this.pages.item(this.currPageIdx);
            newPage = this.pages.item(this.currPageIdx + 1);

            // wrap original page
            newPage.removeClass('hidden');
            var oldPageWrapper = Y.Node.create('<div class="left-wrapper page"></div>').append(oldPage);
            var newPageWrapper = Y.Node.create('<div class="right-wrapper page"></div>').append(newPage);
            this.cb.append(oldPageWrapper);
            this.cb.append(newPageWrapper);

            oldPageClone = oldPage.cloneNode(true);
            newPageClone = newPage.cloneNode(true);
            //newPageClone.addClass('back').removeClass('hidden');
            newPageClone.removeClass('hidden');

            shadowSamuri1 = Y.Node.create('<div class="right-half page"></div>').append(oldPageClone);
            shadowSamuri1.setStyles({
                //position: 'absolute',
                width: this.pageWidth / 2, //hack the offset?
            });
            shadowSamuri1.appendTo(this.cb);

            shadowSamuri2 = Y.Node.create('<div class="left-half page"></div>').append(newPageClone);
            shadowSamuri2.setStyles({
                //position: 'absolute',
                width: this.pageWidth / 2 , //hack the offset?
            });
            shadowSamuri2.appendTo(this.cb);

            shadowSamuri1.transition({
                duration: 2,
                transform: 'rotateY(-180deg)'
            }, function() {
                that.currPageIdx ++;
                oldPage.addClass('hidden');
                newPage.removeClass('hidden');
                //shadowSamuri1.remove();
                
                //that.pages.item(that.currPageIdx).removeClass('hidden');
            });

            shadowSamuri2.transition({
                duration: 2,
                transform: 'rotateY(0)'
            }, function() {
                that.currPageIdx ++;
                oldPage.addClass('hidden');
                newPage.removeClass('hidden');
                //shadowSamuri2remove();
                
                //that.pages.item(that.currPageIdx).removeClass('hidden');
            });
        } 
    },

    prev: function() {
        if (this.currPageIdx > 0) {
            this.pages.item(this.currPageIdx).addClass('hidden');
            this.currPageIdx --;
            this.pages.item(this.currPageIdx).removeClass('hidden');
        }
    }
},
{
    NAME: 'flipview',
    ATTRS: {
    }
});

},
'0.0.1',
{
    requires: ['base', 'widget', 'node', 'event-flick', 'transition']
});
