$(function() {
var win = window,
    doc = document,
    currentEnlargedTile,
    ZOOM_TIME = 0.15,

    EXPANDED_WIDTH = 313;
    EXPANDED_HEIGHT = 345;
    //COLLAPSED_WIDTH = 144;
    //COLLAPSED_HEIGHT = 90;

    searchPane = $('#search-pane'),
    tilePane = $('#tile-pane'),
    tapEvent = 'ontouchend' in doc ? 'tap' : 'click';

function expandTile(tile)
{
    var offsetX = 0;
    tile.expand();

    $('.tile').each(function() {
        var t = $(this);
        if (tile.attr('id') != t.attr('id')) {
            t.addClass('minify')

            t.anim({
                '-webkit-transform' : 'translate(' + offsetX + 'px, ' + 50 + 'px)',
            }, ZOOM_TIME, 'ease-in', function() {
            });

            offsetX += 80;
        }
    });
}

function collpaseTile(tile)
{
    tile.collpase();

    $('.tile').each(function() {
        var t = $(this);
        if (tile.attr('id') != t.attr('id')) {
            t.removeClass('minify')
            t.reset();
        }
    });
}

function switch2SearchPane() {
    $('body').css({
        '-webkit-transform' : 'translate(320px, 0)'
    });
}

function switch2TilePane() {
    $('body').css({
        '-webkit-transform' : 'translate(0, 0)'
    });
}


//extend $ to have some methods
$.fn.expand = function() {
    var that = this,
        ex = that.data('expanded-x'),
        ey = that.data('expanded-y') || 110,
        ew = parseInt(that.data('expanded-w'));

    that.addClass('expanded');
    that.css({'z-index':100});
    that.anim({
        'width' : ew,
        '-webkit-transform' : 'translate(' + ex + 'px, ' + ey + 'px)',
        'height' :  EXPANDED_HEIGHT
    }, ZOOM_TIME, 'ease-in', function() {
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
        'height' : h
    }, ZOOM_TIME, 'ease-out', function() {
        that.css({'z-index':0});

        that.removeClass('expanded');
    });
};

$.fn.init = function(options) {
    var x = options.x,
        y = options.y;
    this.data('x', x);
    this.data('y', y);
    this.data('width', options.w);
    this.data('height', options.h);
    this.data('expanded-x', options.ex);
    this.data('expanded-w', options.ew);

    this.css({
        '-webkit-transform' : 'translate(' + x + 'px, ' + y + 'px)'
    });
};

$.fn.reset = function() {
    var x = this.data('x'),
        y = this.data('y');

    this.anim({
        '-webkit-transform' : 'translate(' + x + 'px, ' + y + 'px)'
    }, ZOOM_TIME, 'ease-in', function() {
    });
}

$.fn.showConversation = function(convs, interval) {
    var i = 0,
        that = this;
        len = convs.length;

    function showConv() {
        if (i < len) {
            that.html(that.html() + convs[i]);

            convView.refresh();
            if (convView.maxScrollY < 0)
            {
                convView.scrollToElement('li:last-child', 1);
            }

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
var convView = new iScroll('conv-view', {
    snap: 'li'
});

// change height
if ( ('standalone' in window.navigator) && !window.navigator.standalone) {
    $('body').removeClass('app-mode');
}

// disable page swiping
$(document).on('touchmove', function(e) {
    e.preventDefault();
});

// init tile layout
$('#tile-weather').init({x:10, y:50, w:147, h:112, ex:10, ew: 303});
$('#tile-email').init({x:165, y:44, w:147, h:118, ex:10, ew: 303});
$('#tile-twitter').init({x:10, y:165, w:147, h:118, ex:10, ew: 303});
$('#tile-facebook').init({x:165, y:165, w:147, h:118, ex:10, ew: 303});
$('#tile-push-info').init({x:0, y:290, w:312, h:160, ex:0, ew: 313});

tilePane.swipeRight(function(e) {
    switch2SearchPane();
});

searchPane.swipeLeft(function(e) {
    switch2TilePane();
});

tilePane.delegate('.tile', tapEvent, function(e) {
    var target = $(this);

    if (target.hasClass('minify')) {
        return;
    }

    if (currentEnlargedTile && (target.get(0) == currentEnlargedTile.get(0))) {
        collpaseTile(target);
        currentEnlargedTile = null;
    } else {
        //target.expand();
        expandTile(target);

        if (currentEnlargedTile) {
            collpaseTile(target);
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
    switch2SearchPane();
});

$('#back_to_tile').on(tapEvent, function(e) {
    switch2TilePane();
});

$('#icon-text').on(tapEvent, function(e) {
    $('#conv-list').showConversation([
        '<li><img src="slices/Chat_2_1.png" width="279" height="39"></li>',
        '<li><img src="slices/Chat_2_2.png" width="279" height="58"></li>',
        '<li><img src="slices/Chat_2_3.png" width="284" height="222"><br><img src="slices/Chat_2_4.png" width="266" height="38"></li>',

        '<li><img src="slices/Chat_3_1.png" width="279" height="48"></li>',
        '<li><img src="slices/Chat_3_2.png" width="169" height="297"></li>',
        '<li><img src="slices/Chat_3_3.png" width="279" height="48"></li>',
        '<li><img src="slices/Chat_3_4.png" width="279" height="58"></li>'
    ], 1200);

});

$('#icon-voice').on(tapEvent, function(e) {
    $('#conv-list').showConversation([
        '<li><img src="slices/Chat_1_1.png" width="279" height="39"></li>',
        '<li><img src="slices/Chat_1_2.png" width="279" height="58"></li>',

        '<li><img src="slices/Chat_1_3.png" width="284" height="222"><br><img src="slices/Chat_1_4.png" width="266" height="32"></li>'

    ], 1200);
});

$('#icon-photo').on(tapEvent, function(e) {
    $('#conv-list').showConversation([
        '<li><img src="slices/Chat_4_2.png" width="279" height="116"></li>',
        '<li><img src="slices/Chat_4_3.png" width="279" height="58"></li>',
        '<li><img src="slices/Chat_4_4.png" width="284" height="222"></li>'
    ], 1200);
});


$('body').css('display', 'block');

// end of ready callback
});
