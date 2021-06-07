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

    for (const element in args['defaults']) {
        const conf = args['defaults'][element];

        for (const e of $(element).toArray()) {
            const o = $(e);
            const attrs = conf['attr'],
                  styles = conf['style'];

            for (const attr in attrs) {
                const v = o.attr(attr);
                if (typeof v !== 'undefined' && v !== false)
                    continue;
                o.attr(attr, attrs[attr]);
            }
            for (const style in styles) {
                if (typeof o.css(style) !== 'undefined')
                    continue;
                o.css(style, styles[style]);
            }
        }
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
    var args = module_args(args, {
        renderers: undefined,
        default_renderer: undefined
    });

    function render(parent, selector) {
        const attr_src = 'src',
              attr_format = 'format';

        function render_fn(o, text, renderer) {
            o.html(
                typeof renderer !== 'undefined' ?
                    renderer(text) : text
            );
            render(o, selector);
        }

        for (const e of parent.find(selector).toArray()) {
            var o = $(e);
            var src = o.attr(attr_src);
            var renderer = o.attr(attr_format);
            if (typeof renderer === 'undefined' || renderer === false)
                renderer = args['default_renderer'];
            renderer = args['renderers'][renderer];

            if (typeof src === 'undefined' || src === false) {
                render_fn(o, o.html(), renderer);
            } else {
                $.get(src, function (data) {
                    render_fn(o, data, renderer);
                });
            }
        }
    }

    render($(document), 'md');
};

modules['wait-requests'] = function (args) {
    var args = module_args(args, {
        callback: undefined
    });

    var callback = args['callback'];
    if (typeof callback !== 'undefined') {
        $(document).ajaxStop(callback);
    }
};
