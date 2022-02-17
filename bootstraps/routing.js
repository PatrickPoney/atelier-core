"use strict";

const router = require("../app/modules/router");

module.exports = async app => {

    app.use(async (context, next) => {

        context.state.params = {};

        const route = context.state.route = await router.match(context.request);

        if (route) {

            context.state.params = route.resolve(context.request);

            await route.handler(context, next);

        } else {

            const routes = router.all.filter(route => route.methods.indexOf(context.request.method) === -1);
            const matches = [];

            for (let i = 0; i < routes.length; i++) {
                const route = routes[i];

                if (route.compares(context.request) === true) {
                    matches.push(route);
                }
            }

            // In case the url matches but the method is not allowed
            if (matches.length > 0) {
                context.throw(405);
            }

            await next();

        }

    });

};