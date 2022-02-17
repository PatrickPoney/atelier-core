"use strict";

module.exports = async (action, context) => {
    await context.events.emit("guard:action", context);

    const role = context.state.role;

    if (!role) {
        context.throw(401);
    }

    const permissions = role.permissions || [];

    // Users with super role doesn't require permission check
    let granted = role.super ? true : permissions.indexOf(action) !== -1;

    if (granted) {
        const result = await context.events.emit(`guard:action [${action}]`, context);

        granted = typeof result === "boolean" ? result : granted;
    }

    if (!granted) {
        context.throw(403);
    }
};