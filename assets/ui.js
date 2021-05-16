'use strict';
console.assert(typeof $ === 'function');


function init_toggle_button(
    attr_toggle_button = '.ui-toggle',
    attr_checked = 'data-checked',
    ev_checked = 'toggle:checked', ev_unchecked = 'toggle:unchecked'
) {
    /*$(document).on({
        ready: function () {
            $(this).trigger(ev_unchecked);
            console.log('ready');
        },
        click: function () {
            var checked = $(this).attr(attr_checked);

            if (typeof checked === 'undefined' || checked === false) {
                $(this).attr(attr_checked, '');
                $(this).trigger(ev_checked);
            } else {
                $(this).removeAttr(attr_checked);
                $(this).trigger(ev_unchecked);
            }
        }
    }, attr_toggle_button);*/


    $(attr_toggle_button).trigger(ev_unchecked);

    $(attr_toggle_button).click(function () {
        var checked = $(this).attr(attr_checked);

        if (typeof checked === 'undefined' || checked === false) {
            $(this).attr(attr_checked, '');
            $(this).trigger(ev_checked);
        } else {
            $(this).removeAttr(attr_checked);
            $(this).trigger(ev_unchecked);
        }
    });
}
