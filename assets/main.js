'use strict';
if (typeof $ != 'function') {
    throw new Error('Required module not loaded');
}

function handle_overflow(parent, child, axis, fn, rfn)
{
    function overflow_x(parent, child) {
        return child.prop('scrollWidth') > child.prop('clientWidth');
    }
    function overflow_y(parent, child) {
        return child.prop('scrollHeight') > child.prop('clientHeight');
    }
    function overflow(parent, child) {
        switch (axis) {
            case 'x':
                return overflow_x(parent, child);
            case 'y':
                return overflow_y(parent, child);
            case 'xy':
                return overflow_x(parent, child) || overflow_y(parent, child);
            default:
                return false;
        }
    }

    return parent.on(
        'load resize', function () {
            return overflow(parent, child) ? fn(child) : rfn(child);
        });
}

$(document).ready(
    function () {
        var overflow_thres = undefined;

        handle_overflow(
            $(window), $(document.body), 'x',
            function (o) {
                overflow_thres = overflow_thres != undefined ?
                    Math.max(overflow_thres, o.width()) : o.width();
                o.attr('data-overflow', '');
            },
            function (o) {
                if (overflow_thres != undefined &&
                    o.width() <= overflow_thres)
                    return;
                o.removeAttr('data-overflow');
            }
        );
    }
);
