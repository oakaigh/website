'use strict';
console.assert(typeof $ === 'function');


function set_ui_toggleable(
    o, attr_checked = 'data-checked',
    attr_onchecked = 'data-onchecked', attr_onunchecked = 'data-onunchecked',
    ev_checked = 'toggle:checked', ev_unchecked = 'toggle:unchecked'
) {
    function set_state(o, checked) {
        if (checked) {
            o.attr(attr_checked, '');
            o.trigger(ev_checked);
            eval(o.attr(attr_onchecked));
        } else {
            o.removeAttr(attr_checked);
            o.trigger(ev_unchecked);
            eval(o.attr(attr_onunchecked));
        }
    }

    function get_state(o) {
        var checked = o.attr(attr_checked);
        return typeof checked !== 'undefined' && checked !== false;
    }

    set_state(o, get_state(o));
    o.on('click', function () {set_state($(this), !get_state($(this)));});
}

function init_toggle_button(
    attr_toggle_button = '.ui-toggle'
) {
    return set_ui_toggleable($(attr_toggle_button));
}
