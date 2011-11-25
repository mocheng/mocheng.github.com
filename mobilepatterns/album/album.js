YUI.add('album', function(Y) {

var FLICK_MIN_DISTANCE = 15;

Y.Album = Y.Base.create('album', Y.Widget, [],
{
    initializer: function() {
        this.cb = this.get('contentBox');
    },

    destructor: function() {
    },

    renderUI: function() {
        this.fold();
    },

    bindUI: function() {
        this.cb.on('flick', function(e) {
            var offsetX = 0,
                endTarget = e.target,
                distance = e.flick.distance;

            if (this.folded && distance > 0) {
                this.unfold();
            }
            if (!this.folded && distance < 0) {
                this.fold();
            }
        }, {
            minDistance: FLICK_MIN_DISTANCE,
            axis: 'x',
            minVelocity: 0,
            preventDefault: true
        }, this);
    },

    unfold: function() {
        this.fold(true);
    },

    fold: function(unfold) {
        var contentBox = this.get('contentBox'),
            offsetX = 0;

        var cards = contentBox.all('.album-card');
        nodeCount = cards.size();

        cards.each(function(node, idx, list) {
            node.setStyles({
                '-webkit-transition': '0.55s ease-out', // TODO: make this mess clearer
                '-webkit-transform': 'translate(' + offsetX +'px, 0)',
                position: 'absolute',
                'z-index': nodeCount - idx,
            });

            offsetX += unfold ? this.get('unfoldedDistance') : this.get('foldedDistance');
        }, this);

        this.folded = !unfold;
    }

},
{
    NAME: 'album',
    ATTRS: {
        unfoldedDistance: {
            value: 160
        },
        foldedDistance: {
            value: 50
        }
    }
});

},
'0.0.1',
{
    requires: ['base', 'widget', 'node', 'event-flick', 'transition']
});
