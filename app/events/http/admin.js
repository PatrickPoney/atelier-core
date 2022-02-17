"use strict";

const apiTokens = require("./admin/api-tokens");
const settings = require("./admin/settings");
const roles = require("./admin/roles");
const users = require("./admin/users");

module.exports = async app => {

    app.use(async (context, next) => {

        context.events.on("admin:apiTokens creating", apiTokens.creating);
        context.events.on("admin:apiTokens created", apiTokens.created);
        context.events.on("admin:apiTokens updating", apiTokens.updating);
        context.events.on("admin:apiTokens updated", apiTokens.updated);
        context.events.on("admin:apiTokens deleting", apiTokens.deleting);
        context.events.on("admin:apiTokens deleted", apiTokens.deleted);

        context.events.on("admin:settings creating", settings.creating);
        context.events.on("admin:settings created", settings.created);
        context.events.on("admin:settings updating", settings.updating);
        context.events.on("admin:settings updated", settings.updated);
        context.events.on("admin:settings deleting", settings.deleting);
        context.events.on("admin:settings deleted", settings.deleted);

        context.events.on("admin:roles creating", roles.creating);
        context.events.on("admin:roles created", roles.created);
        context.events.on("admin:roles updating", roles.updating);
        context.events.on("admin:roles updated", roles.updated);
        context.events.on("admin:roles deleting", roles.deleting);
        context.events.on("admin:roles deleted", roles.deleted);

        context.events.on("admin:users creating", users.creating);
        context.events.on("admin:users created", users.created);
        context.events.on("admin:users updating", users.updating);
        context.events.on("admin:users updated", users.updated);
        context.events.on("admin:users deleting", users.deleting);
        context.events.on("admin:users deleted", users.deleted);

        await next();

    });

};