'use strict';

var modules = {};

function module_args(args, defaults) {
    return Object.assign({}, defaults, args);
}

function module_init(conf) {
    for (const name in conf) {
        let mod = modules[name];
        let args = conf[name];

        if (typeof mod !== 'function')
            throw new Error('Invalid module: ' + name);
        mod(args);
    }
}

function dependency_check(deps) {
    for (let name in deps) {
        let objects = deps[name];
        for (let o in objects) {
            let type = objects[o];
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
$.fn.hasAttr = function (name) {  
    let attr = this.attr(name);
    return typeof attr !== 'undefined' && attr !== false;
};

modules['dom-defaults'] = function (_args)
{
    let args = module_args(_args, {
        defaults: {}
    });

    for (const element in args.defaults) {
        const conf = args.defaults[element];

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

modules['anchor-target'] = function (_args)
{
    let args = module_args(_args, {
        target: $('[data-target-index]')
    });

    if ($(':target').length === 0) {
        location.replace('#' + $(args.target).attr('id'));
    }
};

modules['markdown'] = function (_args)
{
    let args = module_args(_args, {
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

        console.log(parent.find(selector));
        for (const e of parent.find(selector).toArray()) {
            let o = $(e);

            let renderer = args.renderers[
                o.hasAttr(attr_format)
                    ? o.attr(attr_format) 
                    : args.default_renderer
            ];

            if (o.hasAttr(attr_src)) {
                let src = o.attr(attr_src);
                $.get(src, function (data) {
                    render_fn(o, data, renderer);
                });                
            } else {
                render_fn(o, o.html(), renderer);
            }
        }
    }

    render($(document), 'md');
};

modules['wait-requests'] = function (_args) {
    let args = module_args(_args, {
        callback: undefined
    });

    let callback = args.callback;
    if (typeof callback !== 'undefined') {
        $(document).ajaxStop(callback);
    }
};
