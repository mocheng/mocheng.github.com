$(function() {
var doc = document,
    currentEnlargedTile,
    ZOOM_TIME = 0.3,

    EXPANDED_WIDTH = 300;
    EXPANDED_HEIGHT = 300;
    //COLLAPSED_WIDTH = 144;
    //COLLAPSED_HEIGHT = 90;

    tileContent = $('.tile_content'),
    tapEvent = 'ontouchend' in doc ? 'tap' : 'click';

//extend $ to have some methods
$.fn.expand = function() {
    var that = this;

    that.css({'z-index':100});
    that.anim({
        '-webkit-transform' : 'translate(0, 0)',
        'width' : EXPANDED_WIDTH,
        'height' :  EXPANDED_HEIGHT
    }, ZOOM_TIME, 'ease-out', function() {
    });
};

$.fn.collpase = function() {
    var that = this,
        x = that.data('x'),
        y = that.data('y'),
        w = parseInt(that.data('width')),
        h = parseInt(that.data('height'));

    that.anim({
        '-webkit-transform' : 'translate(' + x +'px, ' + y +'px)',
        'width' : w,
        'height' : 90
    }, ZOOM_TIME, 'ease-out', function() {
        that.css({'z-index':0});
    });
};

$.fn.init = function(x, y, w, h) {
    this.data('x', x);
    this.data('y', y);
    this.data('width', w);
    this.data('height', h);

    this.css({
        '-webkit-transform' : 'translate(' + x + 'px, ' + y + 'px)'
    });
};

// disable page swiping
$(document).on('touchmove', function(e) {
    e.preventDefault();
});

// init tile layout
$('#tile1').init(0, 0, 144, 90);
$('#tile2').init(150, 0, 144, 90);
$('#tile3').init(0, 100, 144, 90);
$('#tile4').init(150, 100, 144, 90);
$('#tile5').init(0, 200, 294, 90);

tileContent.delegate('.tile', tapEvent, function(e) {
    var target = $(this);

    if (currentEnlargedTile && (target.get(0) == currentEnlargedTile.get(0))) {
        target.collpase();
        currentEnlargedTile = null;
    } else {
        target.expand();

        if (currentEnlargedTile) {
            target.collpase();
        }
        currentEnlargedTile = target;
    }

});

$('#search').on(tapEvent, function(e) {
    $('body').css({
        '-webkit-transform' : 'translate(320px, 0)'
    });
});

// end of ready callback
});
