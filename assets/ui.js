'use strict';
console.assert(typeof $ === 'function');

var modules;

function ui_bistate_dispatch(o, state, args)
{
    switch (state) {
        case true:
            o.attr(args['attr'], '');
            if (args['ev']['on'] !== undefined)
                o.trigger(args['ev']['on']);
            eval(o.attr(args['ev_attr']['on']));
            break;
        case false:
            o.removeAttr(args['attr']);
            if (args['ev']['off'] !== undefined)
                o.trigger(args['ev']['off']);
            eval(o.attr(args['ev_attr']['off']));
            break;
        default:
            break;
    }
}


modules['toggle-switch'] = function (args)
{
    const ui_toggleable = '.ui-toggle';
    const ui_attr_checked = 'data-checked';
    const ui_dispatch_opts = {
        attr: ui_attr_checked,
        ev: {
            on: 'toggle:checked',
            off: 'toggle:unchecked'
        },
        ev_attr: {
            on: 'data-onchecked',
            off: 'data-onunchecked'
        }
    };

    var args = module_args(args, {
        target: $(ui_toggleable)
    });

    function set_state(o, checked) {
        ui_bistate_dispatch(o, checked, ui_dispatch_opts);
    }

    function get_state(o) {
        var checked = o.attr(ui_attr_checked);
        return typeof checked !== 'undefined' && checked !== false;
    }

    set_state(args['target'], get_state(args['target']));
    args['target'].on('click', function () {
        set_state($(this), !get_state($(this)));
    });
};

modules['overflow'] = function (args)
{
    const ui_dispatch_opts = {
        attr: 'data-overflow',
        ev: {
            on: 'responsive:overflow',
            off: 'responsive:unoverflow'
        },
        ev_attr: {
            on: 'data-onoverflow',
            off: 'data-offoverflow'
        }
    };

    var args = module_args(args, {
        axis: 'xy',
        child: $(document.body),
        parent: $(window)
    });

    function handle_overflow(
        parent, child, axis,
        fn, rfn
    ) {
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

        var overflow_thres = undefined;

        function overflow_fn() {
            if (overflow(parent, child, axis)) {
                overflow_thres = overflow_thres !== undefined ?
                    Math.max(overflow_thres, child.width()) : child.width();
                return fn(child);
            }

            if (overflow_thres !== undefined &&
                child.width() <= overflow_thres)
                return;
            return rfn(child);
        }

        overflow_fn();
        parent.on('resize', overflow_fn);
    }

    return handle_overflow(
        args['parent'], args['child'], args['axis'],
        function (o) {
            return ui_bistate_dispatch(o, true, ui_dispatch_opts);
        },
        function (o) {
            return ui_bistate_dispatch(o, false, ui_dispatch_opts);
        }
    );
};
