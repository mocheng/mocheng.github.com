$(function() {
var win = window,
    doc = document,
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

$.fn.showConversation = function(convs, interval) {
    var i = 0,
        that = this;
        len = convs.length;

    function showConv() {
        if (i < len) {
            that.html(that.html() + convs[i]);
            /*
            alert(that.attr('scrollHeight'));
            that.attr('scrollTop', that.attr('scrollHeight'));
            alert(that.attr('scrollTop'));
            */
            ++i;

            setTimeout(showConv, interval);
        }
    };
    setTimeout(showConv, interval);
};

// for iscroll
var convView = new iScroll('conv-view');

// change height
if ( ('standalone' in window.navigator) && window.navigator.standalone) {
    $('body').addClass('app-mode');
}

// disable page swiping
/*
$(document).on('touchmove', function(e) {
    e.preventDefault();
});
*/

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


$(window).on('load', function() {
    /mobile/i.test(navigator.userAgent) && 
    !location.hash && 
    setTimeout(function () {
        if (!win.pageYOffset) window.scrollTo(0, 1); 
    }, 200);
});

$('#search').on(tapEvent, function(e) {
    $('body').css({
        '-webkit-transform' : 'translate(320px, 0)'
    });
});

$('#back_to_tile').on(tapEvent, function(e) {
    $('body').css({
        '-webkit-transform' : 'translate(0, 0)'
    });
});

$('#icon-voice').on(tapEvent, function(e) {
    $('#conv-list').showConversation([
        '<li><img src="slices/Chat_1_1.png" width="279" height="39"></li>',
        '<li><img src="slices/Chat_1_2.png" width="279" height="58"></li>',

        '<li><img src="slices/Chat_1_1.png" width="279" height="39"></li>',
        '<li><img src="slices/Chat_1_2.png" width="279" height="58"></li>',

        '<li><img src="slices/Chat_1_3.png" width="284" height="222"><br><img src="slices/Chat_1_4.png" width="266" height="32"></li>'
    ], 450);
});


// end of ready callback
});
