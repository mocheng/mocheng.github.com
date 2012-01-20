(function($) {
    var waterfall = $.fn.waterfall = function(options) {

        var opts = $.extend({}, waterfall.defaults, options);

        $(this).each(function() {
            var items,
                itemWidth,
                offsetY = [],
                colNum,
                container = $(this),
                containerWidth = container.width();

            container.css('position', 'relative');

            items = $(opts.itemSelector);
            itemWidth = opts.width || items.outerWidth();
            colNum = Math.floor(containerWidth / itemWidth);

            items.each(function(index) {
                var col = index % colNum;

                $this = $(this);
                $this.css({
                    position: 'absolute',
                    left: itemWidth * col,
                    top: offsetY[col]
                });

                offsetY[col] = offsetY[col] || 0;
                offsetY[col] += $this.outerHeight();
            });
        });
    };

    $.fn.waterfall.defaults = {
        itemSelector : '.item'
    };


}(jQuery));
