'use strict';
if (typeof $ != 'function') {
    throw new Error('Required module not loaded');
}

function overflow(parent, child, axis)
{
    switch (axis) {
        case 'x':
            return child.prop('scrollWidth') >
                   child.prop('clientWidth');
        case 'y':
            return child.prop('scrollHeight') >
                   child.prop('clientHeight');
        case 'xy':
            return overflow(parent, child, 'x') ||
                   overflow(parent, child, 'y');
        default:
            break;
    }

    return false;
}

function handle_overflow(parent, child, axis, fn, rfn)
{
    function overflow_fn() {
        return overflow(parent, child, axis) ? fn(child) : rfn(child);
    }

    overflow_fn();
    parent.on('resize', overflow_fn);
}

$(document).ready(
    function ()
    {
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
