YUI.add('album', function(Y) {

var CARD_FOLDED_DISTANCE = 145,
    CARD_UNFOLDED_DISTANCE = 335,
    FLICK_MIN_DISTANCE = 15;

Y.Album = Y.Base.create('album', Y.Widget, [],
{
    initializer: function() {
    },

    destructor: function() {
    },

    renderUI: function() {
        var cards, contentBox, nodeCount, offsetX = 0;

        this.fold();

        //contentBox.set('innerHTML', 'hello world');
    },

    bindUI: function() {
        var contentBox = this.get('contentBox');

        contentBox.on('flick', function(e) {
            var offsetX = 0,
                endTarget = e.target,
                distance = e.flick.distance;

            console.log(this.folded);
            console.log(distance);
            if (this.folded && distance > 0) {
                console.log('unfold');
                this.unfold();
            }
            if (!this.folded && distance < 0) {
                console.log('fold');
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

            console.log(unfold);
            offsetX += unfold ? CARD_UNFOLDED_DISTANCE : CARD_FOLDED_DISTANCE;
            console.log(offsetX);
        });

        this.folded = !unfold;
    }

},
{
    NAME: 'album',
    ATTRS: {
    }
});

},
'0.0.1',
{
    requires: ['base', 'widget', 'node', 'event-flick', 'transition']
});
