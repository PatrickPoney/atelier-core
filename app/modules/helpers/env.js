"use strict";

const get = require("lodash/get");

const env = (key, defaultValue = null) => {
    let value = get(process.env, key);

    switch (value) {
        case "":
        case "null":
            value = null;
            break;
        case "undefined":
            value = undefined;
            break;
        case "true":
            value = true;
            break;
        case "false":
            value = false;
            break;
    }

    return value !== null ? value : defaultValue;
};

module.exports = env;