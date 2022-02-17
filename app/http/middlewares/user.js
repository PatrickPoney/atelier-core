"use strict";

const authorization = require("auth-header");
const compose = require("koa-compose");
const session = require("./session");
const mongodb = require("../../modules/mongodb");

module.exports = compose([session, async (context, next) => {

    await context.events.emit("user:check", context);

    if (!context.state.user) {
        await context.events.emit("user:check fails", context);

        context.set("WWW-Authenticate", authorization.format("Bearer"));
        context.throw(401);

        return;
    }

    await context.events.emit("user:check succeed", context);

    const role = context.state.role = await mongodb.collection("roles").findOne({_id: context.state.user.roleId, deletedAt: {$eq: null}});

    // If role missing or deleted
    if (!role) {
        const session = context.state.session;

        // Role is missing/deleted so we are closing session
        if (session) {
            const values = {
                closed: true,
                closedBy: context.state.user._id,
                closedAt: new Date()
            };

            await mongodb.collection("sessions").updateOne({_id: session._id}, {$set: values});
        }

        context.throw(401);
    }

    await next();

}]);