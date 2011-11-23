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
        var list = this.cb.one('ul:first-child'), count;

        if (!list) {
            return;
        }

        list.addClass('yui3-flipview-list');

        this.pages = list.get('children');
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
            if (e.flick.distance > 0) {
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
        if (this.currPageIdx < this.pages.size() - 1) {
            this.pages.item(this.currPageIdx).addClass('hidden');
            this.currPageIdx ++;
            this.pages.item(this.currPageIdx).removeClass('hidden');
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
