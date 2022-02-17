"use strict";

const routes = [
    "../routes/admin",
    "../routes/api",
    "../routes/web"
];

module.exports = async app => {

    for (let i = 0; i < routes.length; i++) {
        const callable = require(routes[i]);

        await callable(app);
    }

};