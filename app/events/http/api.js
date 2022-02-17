"use strict";

const settings = require("./api/settings");
const roles = require("./api/roles");
const users = require("./api/users");

module.exports = async app => {

    app.use(async (context, next) => {

        context.events.on("api:settings creating", settings.creating);
        context.events.on("api:settings created", settings.created);
        context.events.on("api:settings updating", settings.updating);
        context.events.on("api:settings updated", settings.updated);
        context.events.on("api:settings deleting", settings.deleting);
        context.events.on("api:settings deleted", settings.deleted);

        context.events.on("api:roles creating", roles.creating);
        context.events.on("api:roles created", roles.created);
        context.events.on("api:roles updating", roles.updating);
        context.events.on("api:roles updated", roles.updated);
        context.events.on("api:roles deleting", roles.deleting);
        context.events.on("api:roles deleted", roles.deleted);

        context.events.on("api:users creating", users.creating);
        context.events.on("api:users created", users.created);
        context.events.on("api:users updating", users.updating);
        context.events.on("api:users updated", users.updated);
        context.events.on("api:users deleting", users.deleting);
        context.events.on("api:users deleted", users.deleted);

        await next();

    });

};