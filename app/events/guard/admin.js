"use strict";

const apiTokens = require("./admin/api-tokens");
const settings = require("./admin/settings");
const roles = require("./admin/roles");
const users = require("./admin/users");
const sessions = require("./admin/sessions");

module.exports = async app => {

    // We must handle this in context
    app.use(async (context, next) => {

        context.events.on("guard:action [admin:apiTokens index]", apiTokens.index);
        context.events.on("guard:action [admin:apiTokens post]", apiTokens.post);
        context.events.on("guard:action [admin:apiTokens get]", apiTokens.get);
        context.events.on("guard:action [admin:apiTokens put]", apiTokens.put);
        context.events.on("guard:action [admin:apiTokens delete]", apiTokens.delete);

        context.events.on("guard:action [admin:settings index]", settings.index);
        context.events.on("guard:action [admin:settings post]", settings.post);
        context.events.on("guard:action [admin:settings get]", settings.get);
        context.events.on("guard:action [admin:settings put]", settings.put);
        context.events.on("guard:action [admin:settings delete]", settings.delete);

        context.events.on("guard:action [admin:roles index]", roles.index);
        context.events.on("guard:action [admin:roles post]", roles.post);
        context.events.on("guard:action [admin:roles get]", roles.get);
        context.events.on("guard:action [admin:roles put]", roles.put);
        context.events.on("guard:action [admin:roles delete]", roles.delete);

        context.events.on("guard:action [admin:users index]", users.index);
        context.events.on("guard:action [admin:users post]", users.post);
        context.events.on("guard:action [admin:users get]", users.get);
        context.events.on("guard:action [admin:users put]", users.put);
        context.events.on("guard:action [admin:users delete]", users.delete);

        context.events.on("guard:action [admin:sessions index]", sessions.index);
        context.events.on("guard:action [admin:sessions get]", sessions.get);
        context.events.on("guard:action [admin:sessions close]", sessions.close);

        await next();

    });

};