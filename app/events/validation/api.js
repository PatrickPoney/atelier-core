"use strict";

const settings = require("./api/settings");

module.exports = async app => {

    // We must handle this in context
    app.use(async (context, next) => {

        context.events.on("validate:schema [api:settings post] succeed", settings.post);
        context.events.on("validate:schema [api:settings put] succeed", settings.put);

        await next();

    });

};