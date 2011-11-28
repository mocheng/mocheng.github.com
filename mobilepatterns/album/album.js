YUI.add('album', function(Y) {

var FLICK_MIN_DISTANCE = 15;

//
// Y.Album represents card-fold
//
Y.Album = Y.Base.create('album', Y.Widget, [],
{
    initializer: function() {
        this.cb = this.get('contentBox');
        this.cardFolds = this.cb.all('.card-fold');
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

        this.cb.delegate('click', function(e) {
            if (!this._collpased) {
                this.unfold(e.currentTarget);
            }
        }, '.card-fold', this);
    },

    unfold: function(cardFold) {
        if (cardFold.getData('folding')) {
            return;
        }
        cardFold.setData('folding', true);

        cardFold.addClass('unfolded');

        var cards = cardFold.all('.single-card');

        //this._rotate(cards);
        this.rotate(cardFold);

        cardFold.setData('folding', false);
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

        var cards = contentBox.all('.card-fold');
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
    }

},
{
    NAME: 'album',
    ATTRS: {
        unfoldDuration: {
            value: 0.5
        },
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
