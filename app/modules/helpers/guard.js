"use strict";

module.exports = async (action, context, requiresUserAuthentication = true) => {
    await context.events.emit("guard:action", context);

    let passes = false;

    // We need to make an user is authenticated and has the required permission
    if (requiresUserAuthentication) {
        const user = context.state.user;

        if (!user) {
            context.throw(401);
        }

        // A user can have multiple roles thus we need to gather all permissions from all roles before the check
        const roles = context.state.roles || [];
        const permissions = roles.map(role => role.permissions || []).reduce((a, b) => a.concat(b), []);

        // Permission check for everyone but super users
        passes = user ? (user.super ? true : permissions.indexOf(action) !== -1) : true;
    } else {
        const apiToken = context.state.apiToken;

        // An active api token session is required here
        if (!apiToken) {
            context.throw(401);
        }

        passes = true;
    }

    if (passes) {
        const result = await context.events.emit(`guard:action [${action}]`, context);

        passes = typeof result === "boolean" ? result : passes;
    }

    if (!passes) {
        context.throw(403);
    }
};