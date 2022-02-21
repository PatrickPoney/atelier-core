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

    const roleIds = context.state.user.roleIds || [];

    if (roleIds.length > 0) {
        context.state.roles = await mongodb.collection("roles").find({_id: {$in: roleIds}, deletedAt: {$eq: null}});
    }

    await next();

}]);