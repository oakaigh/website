'use strict';

function module_check(modules) {
    for (var name in modules) {
        var objects = modules[name];
        for (var o in objects) {
            var type = objects[o];
            try {
                o = eval(o);
                if (typeof o != type) {
                    throw new Error(
                        'Required module ' + name +
                        ' not loaded (type ' + typeof o + ')'
                    );
                }
            } catch (e) {
                throw new Error('Error loading module ' + name + ': ' + e);
            }
        }
    }
}

module_check({
    'jquery': {$: 'function'}
});


function init_overflow_handler(
    axis = 'xy', child = $(document.body), parent = $(window),
    attr_overflow = 'data-overflow',
    fn = undefined, rfn = undefined
) {
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
        parent, child, axis,
        function (o) {
            o.attr(attr_overflow, '');
            if (fn !== undefined) return fn(o);
        },
        function (o) {
            o.removeAttr(attr_overflow);
            if (rfn !== undefined) return fn(o);
        }
    );
}

function init_target_index(
    attr_target_index = '[data-target-index]'
) {
    if ($(':target').length === 0) {
        location.replace('#' + $(attr_target_index).attr('id'));
    }
}

function init_markdown(
    renderers, default_renderer,
    attr_renderer = 'format',
    attr_md = 'md', attr_md_src = 'src'
) {
    function render_markdown(o, text, renderer) {
        return o.html(eval(renderers[renderer])(text));
    }

    $(attr_md).each(
        function () {
            var o = $(this);
            var src = o.attr(attr_md_src);
            var renderer = o.attr(attr_renderer);
            if (typeof renderer === 'undefined' || renderer === false)
                renderer = default_renderer;

            if (typeof src === 'undefined' || src === false) {
                render_markdown(o, o.html(), renderer);
            } else {
                $.get(src, function (data) {
                    render_markdown(o, data, renderer);
                });
            }
        }
    );
}

function init_dom_defaults(defaults) {
    function has_attr(o, name) {
        const attr = o.attr(name);
        return typeof attr !== 'undefined' && attr !== false;
    }

    for (const element in defaults) {
        const attrs = defaults[element];
        $(element).each(
            function () {
                const o = $(this);
                for (const attr in attrs) {
                    if (!has_attr(o, attr))
                        o.attr(attr, attrs[attr]);
                }
            }
        );
    }
}
