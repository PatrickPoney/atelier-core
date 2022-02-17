"use strict";

const settings = require("./api/settings");
const roles = require("./api/roles");
const users = require("./api/users");

module.exports = async app => {

    // We must handle this in context
    app.use(async (context, next) => {

        context.events.on("guard:action [api:settings index]", settings.index);
        context.events.on("guard:action [api:settings post]", settings.post);
        context.events.on("guard:action [api:settings get]", settings.get);
        context.events.on("guard:action [api:settings put]", settings.put);
        context.events.on("guard:action [api:settings delete]", settings.delete);

        context.events.on("guard:action [api:roles index]", roles.index);
        context.events.on("guard:action [api:roles post]", roles.post);
        context.events.on("guard:action [api:roles get]", roles.get);
        context.events.on("guard:action [api:roles put]", roles.put);
        context.events.on("guard:action [api:roles delete]", roles.delete);

        context.events.on("guard:action [api:users index]", users.index);
        context.events.on("guard:action [api:users post]", users.post);
        context.events.on("guard:action [api:users get]", users.get);
        context.events.on("guard:action [api:users put]", users.put);
        context.events.on("guard:action [api:users delete]", users.delete);

        await next();

    });

};