"use strict";

const listeners = [
    "../events",
    "../events/guard/admin",
    "../events/guard/api",
    "../events/validation/admin",
    "../events/validation/api",
    "../events/http/admin",
    "../events/http/api",
];

module.exports = async app => {

    for (let i = 0; i < listeners.length; i++) {
        const callable = require(listeners[i]);

        await callable(app);
    }

};