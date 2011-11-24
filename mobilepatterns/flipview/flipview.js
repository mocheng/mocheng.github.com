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
        var oldPage, oldPageClone, oldPageClipper,
            newPage, newPageClone, newPageClipper,
            oldShadowSamuri, newShadowSamuri,
            that = this;

        if ( (this.currPageIdx >= this.pages.size() - 1) || this.flipping ) {
            return;
        }

        oldPage = this.pages.item(this.currPageIdx);
        newPage = this.pages.item(this.currPageIdx + 1);

        newPage.removeClass('hidden');

        // clipper original page to show only half
        oldPageClipper = Y.Node.create('<div class="left-clipper page"></div>').append(oldPage);
        newPageClipper = Y.Node.create('<div class="right-clipper page"></div>').append(newPage);
        this.cb.append(oldPageClipper);
        this.cb.append(newPageClipper);

        // cloned page is to show flipping effect
        oldPageClone = oldPage.cloneNode(true);
        newPageClone = newPage.cloneNode(true);
        newPageClone.removeClass('hidden');

        /*
        newPageClone.addClass('flipped');

        var flip = Y.Node.create('<div class="flip page"></div>');

        oldPageClone.appendTo(flip);
        newPageClone.appendTo(flip);
        flip.appendTo(this.cb);

        flip.transition({
            duration: 2,
            transform: 'rotateY(-180deg)'
        }, function() {

        });
        */

        oldShadowSamuri = Y.Node.create('<div class="right-half page"></div>').append(oldPageClone);
        oldShadowSamuri.setStyles({
            width: this.pageWidth / 2, //hack the offset?
        });
        oldShadowSamuri.appendTo(this.cb);

        newShadowSamuri = Y.Node.create('<div class="left-half page"></div>').append(newPageClone);
        newShadowSamuri.setStyles({
            width: this.pageWidth / 2 , //hack the offset?
        });
        newShadowSamuri.appendTo(this.cb);

        oldShadowSamuri.transition({
            duration: 2,
            transform: 'rotateY(-180deg)'
        }, function() {
        });

        newShadowSamuri.transition({
            duration: 2,
            transform: 'rotateY(0)'
        }, function() {
            //TODO: this should be done when oldShadowSamuri transition is done as well.
            that.currPageIdx ++;
        });
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
