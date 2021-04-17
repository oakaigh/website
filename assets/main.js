'use strict';
if (typeof $ != 'function') {
    throw new Error('Required module not loaded');
}

function handle_overflow(o, fn, rfn)
{
    return $(window).on(
        'load resize', function () {
            return (o.prop('scrollHeight') > o.prop('clientHeight') ||
                    o.prop('scrollWidth')  > o.prop('clientWidth')) ? fn(o) : rfn(o);
        });
}

$(document).ready(
    function () {
        handle_overflow(
            $(document.body),
            function (o) { o.attr('data-overflow', ''); },
            function (o) { o.removeAttr('data-overflow'); }
        );
    }
);
