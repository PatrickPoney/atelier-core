"use strict";

const pick = require("lodash/pick");
const cloneDeep = require("lodash/cloneDeep");
const trim = require("../../modules/helpers/trim");

const $methods = [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
];
const $routes = {};
const $allRoutes = [];

for (let verb of $methods) {
    $routes[verb] = {};
}

const compileRoute = route => {
    const keys = [];
    const required = [];
    const optional = [];

    let regexp = route.uri;

    regexp = regexp.replace(/(?:{(.*?)\?})/g, (__, val) => {
        keys.push(val);
        optional.push(val);

        if (typeof route.wheres[val] !== "undefined") {
            return `(${route.wheres[val]})?`;
        }

        return "(.*?)?";
    });

    regexp = regexp.replace(/(?:{(.*?)})/g, (__, val) => {
        keys.push(val);
        required.push(val);

        if (typeof route.wheres[val] !== "undefined") {
            return `(${route.wheres[val]})`;
        }

        return "(.*?)";
    });

    route.compiled = {regexp, keys, required, optional};

    return route;
};

const makeRoute = (methods, uri, handler, options) => {
    for (let i = 0; i < methods.length; i++) {
        if ($methods.indexOf(methods[i]) === -1) {
            throw new Error(`Invalid route method [${methods[i]}].`);
        }
    }

    const route = {methods, handler};

    route.uri = `/${trim(uri, "/")}`;
    route.options = pick(options, ["where", "default", "name", "prefix", "secure"]);
    route.prefix = route.options.prefix ? `/${trim(route.options.prefix, "/")}` : "";
    route.path = route.options.prefix ? `${route.prefix}${route.uri}` : route.uri;
    route.name = route.options.name || route.path;
    route.secure = route.options.secure || false;
    route.wheres = route.options.where || {};
    route.defaults = route.options.default || {};
    route.compiled = {};

    route.compares = request => {
        const regexp = `${route.prefix}${route.compiled.regexp}`;

        return (new RegExp(`^${regexp}$`)).exec(request.path) !== null;
    };

    route.matches = request => {
        if (route.methods.indexOf(request.method) === -1) {
            return false;
        }

        return route.compares(request);
    };

    route.resolve = request => {
        const params = cloneDeep(route.defaults);
        const regexp = `${route.prefix}${route.compiled.regexp}`;
        const values = [];

        request.path.replace(new RegExp(`^${regexp}$`), (__, val) => {
            values.push(val);
        });

        for (let key in route.compiled.keys) {
            if (typeof values[key] !== "undefined") {
                params[route.compiled.keys[key]] = values[key];
            }
        }

        return params;
    };

    route.handle = async (...args) => {
        return await route.handler(...args);
    };

    return compileRoute(route);
};

const addRoute = (methods, uri, handler, options) => {
    const route = makeRoute(methods, uri, handler, options);

    for (let method of methods) {
        if (typeof $routes[method] !== "undefined") {
            $routes[method][route.path] = route;
        }
    }

    $allRoutes.push(route);

    return route;
};

const routeGet = (uri, handler, options = {}) => {
    return addRoute(["GET", "HEAD"], uri, handler, options);
};

const routePost = (uri, handler, options = {}) => {
    return addRoute(["POST"], uri, handler, options);
};

const routePut = (uri, handler, options = {}) => {
    return addRoute(["PUT"], uri, handler, options);
};

const routePatch = (uri, handler, options = {}) => {
    return addRoute(["PATCH"], uri, handler, options);
};

const routeDelete = (uri, handler, options = {}) => {
    return addRoute(["DELETE"], uri, handler, options);
};

const match = async request => {
    const routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

    for (let k in routes) {
        if (routes.hasOwnProperty(k)) {
            const route = routes[k];

            if (route.matches(request) === true) {
                return route;
            }
        }
    }
};

module.exports = {

    get: routeGet,
    post: routePost,
    put: routePut,
    patch: routePatch,
    delete: routeDelete,
    match,

    get all() {
        return $allRoutes;
    },

    get methods() {
        return $methods;
    }

};