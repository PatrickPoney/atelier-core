"use strict";

const querystring = require("querystring");
const router = require("../router");
const trimStart = require("../helpers/trimStart");
const cloneDeep = require("lodash/cloneDeep");

let $hostname;
let $port;

const replaceRouteParameters = (route, params = {}) => {
    let path = route.path;
    let extra = cloneDeep(params);

    path = path.replace(/(?:{(.*?)\?})/g, (__, val) => {
        let value = extra[val];

        if (typeof value === "undefined" && typeof route.defaults[val] !== "undefined") {
            value = route.defaults[val];
        }

        delete extra[val];

        return typeof value !== "undefined" ? value : "";
    });

    path = path.replace(/(?:{(.*?)})/g, (__, val) => {
        const value = extra[val];

        if (typeof value !== "undefined") {
            delete extra[val];

            return value;
        }

        throw new Error(`Required route param [${val}] is missing.`);
    });

    return [path, extra];
};

const toRoute = (route, params) => {
    let [path, extra] = replaceRouteParameters(route, params);

    const query = querystring.stringify(extra);
    const protocol = route.secure === true ? "https" : "http";
    const hostname = $hostname || "";
    const port = $port !== 80 ? `:${$port}` : "";

    if (query.length > 0) {
        path = `${path}?${query}`;
    }

    return `${protocol}://${hostname}${port}${path}`;
};

const toUrl = (uri, params = {}, secure) => {
    let path = `/${trimStart(uri, "/")}`;

    const query = querystring.stringify(params);
    const protocol = secure === true ? "https" : "http";
    const hostname = $hostname || "";
    const port = $port !== 80 ? `:${$port}` : "";

    if (query.length > 0) {
        path = `${path}?${query}`;
    }

    return `${protocol}://${hostname}${port}${path}`;
};

const full = request => {
    return request.href;
};

const current = request => {
    return request.path;
};

const previous = request => {
    const referer = request.get("referer");

    if (referer) {
        return to(referer);
    }

    return null;
};

const to = (path, params = {}, secure = false) => {
    return toUrl(path, params, secure);
};

const route = (name, params = {}, relative = true) => {
    for (let i = 0; i < router.all.length; i++) {
        const route = router.all[i];

        if (route.name === name) {
            return toRoute(route, params, relative);
        }
    }

    throw new Error(`Route [${name}] not found.`);
};

module.exports = {

    get hostname() {
        return $hostname;
    },

    set hostname(value) {
        $hostname = value;
    },

    get port() {
        return $port;
    },

    set port(value) {
        $port = value;
    },

    full,
    current,
    previous,
    to,
    route

};

