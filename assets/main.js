'use strict';

var modules = {};

function module_args(args, defaults) {
    return Object.assign({}, defaults, args);
}

function module_init(conf) {
    for (const name in conf) {
        var mod = modules[name];
        var args = conf[name];

        if (typeof mod !== 'function')
            throw new Error('Invalid module: ' + name);
        mod(args);
    }
}

function dependency_check(deps) {
    for (var name in deps) {
        var objects = deps[name];
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

dependency_check({
    'jquery': {$: 'function'}
});


modules['dom-defaults'] = function (args)
{
    var args = module_args(args, {
        defaults: {}
    });

    function has_attr(o, name) {
        const attr = o.attr(name);
        return typeof attr !== 'undefined' && attr !== false;
    }

    for (const element in args['defaults']) {
        const attrs = args['defaults'][element];
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
};

modules['anchor-target'] = function (args)
{
    var args = module_args(args, {
        target: $('[data-target-index]')
    });

    if ($(':target').length === 0) {
        location.replace('#' + $(args['target']).attr('id'));
    }
};

modules['markdown'] = function (args)
{
    const attr_renderer = 'format',
          attr_md = 'md',
          attr_md_src = 'src';

    var args = module_args(args, {
        renderers: undefined,
        default_renderer: undefined
    });

    function render_markdown(o, text, renderer) {
        return o.html(eval(args['renderers'][renderer])(text));
    }

    $(attr_md).each(
        function () {
            var o = $(this);
            var src = o.attr(attr_md_src);
            var renderer = o.attr(attr_renderer);
            if (typeof renderer === 'undefined' || renderer === false)
                renderer = args['default_renderer'];

            if (typeof src === 'undefined' || src === false) {
                render_markdown(o, o.html(), renderer);
            } else {
                $.get(src, function (data) {
                    render_markdown(o, data, renderer);
                });
            }
        }
    );
};
