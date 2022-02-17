"use strict";

const watchers = [
    "../mongodb/watchers/api-tokens",
    "../mongodb/watchers/sessions",
    "../mongodb/watchers/settings",
    "../mongodb/watchers/users",
    "../mongodb/watchers/roles",
];

module.exports = async app => {

    for (let i = 0; i < watchers.length; i++) {
        const callable = require(watchers[i]);

        await callable(app);
    }

};