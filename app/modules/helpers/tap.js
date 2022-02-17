"use strict";

const path = require("path");
const config = require("../../modules/config");

module.exports = (module, method) => {
    return async (...args) => {
        const callable = require(path.join(config.get("path.root"), module));

        return method ? await callable[method](...args) : await callable(...args);
    };
};