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
            oldFlip, newFlip,
            that = this;

        if ( (this.currPageIdx >= this.pages.size() - 1) || this.flipping ) {
            return;
        }

        this.flipping = true;

        oldPage = this.pages.item(this.currPageIdx);
        newPage = this.pages.item(this.currPageIdx + 1);

        newPage.removeClass('hidden');

        // clipper original page to show only half
        oldPageClipper = Y.Node.create('<div class="left-clipper page"></div>').append(oldPage);
        newPageClipper = Y.Node.create('<div class="right-clipper page"></div>').append(newPage);
        newPage.setStyles({'margin-left' : - this.pageWidth/2});
        this.cb.append(oldPageClipper);
        this.cb.append(newPageClipper);

        // cloned page is to show flipping effect
        oldPageClone = oldPage.cloneNode(true);
        newPageClone = newPage.cloneNode(true);
        newPageClone.removeClass('hidden');

        oldPageClone.setStyles({'margin-left' : -this.pageWidth / 2});
        newPageClone.setStyles({'margin-left' : 0});

        oldFlip = Y.Node.create('<div class="right-flip page"></div>').append(oldPageClone);
        oldFlip.setStyles({
            width: this.pageWidth / 2
        });
        oldFlip.appendTo(this.cb);

        newFlip = Y.Node.create('<div class="left-flip page"></div>').append(newPageClone);
        newFlip.setStyles({
            width: this.pageWidth / 2
        });
        newFlip.appendTo(this.cb);

        oldFlip.transition({
            easing: 'ease-in-out',
            duration: this.get('flipDuration'),
            transform: 'rotateY(-180deg)'
        }, function() {
        });

        newFlip.transition({
            easing: 'ease-in-out',
            duration: this.get('flipDuration'),
            transform: 'rotateY(0)'
        }, function() {
            // Ideally this should be sync with oldFlip transition.
            that.currPageIdx ++;

            newPage.setStyles({'margin-left': 0});
            oldPage.addClass('hidden');
            newPage.appendTo(that.cb);
            oldPage.appendTo(that.cb);
            oldPageClipper.remove();
            newPageClipper.remove();
            oldFlip.remove();
            newFlip.remove();

            that.flipping = false;
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
        flipDuration: {
            value:  0.75
        }
    }
});

},
'0.0.1',
{
    requires: ['base', 'widget', 'node', 'event-flick', 'transition']
});
