"use strict";

const settings = require("./admin/settings");

module.exports = async app => {

    // We must handle this in context
    app.use(async (context, next) => {
        
        context.events.on("validate:schema [admin:settings post] succeed", settings.post);
        context.events.on("validate:schema [admin:settings put] succeed", settings.put);

        await next();

    });

};