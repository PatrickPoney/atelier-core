"use strict";

const {ObjectId} = require("mongodb");
const authorization = require("auth-header");
const mongodb = require("../../modules/mongodb");
const config = require("../../modules/config");
const jwt = require("../../modules/jwt");

const fails = async (context, message) => {
    context.set("WWW-Authenticate", authorization.format("Bearer"));
    context.throw(401, message);
};

module.exports = async (context, next) => {

    const token = await jwt.getToken(context);

    if (!token) {
        await fails(context);
    }

    let payload;

    try {
        payload = await jwt.verify(token, {}, config.get("jwt.apiSecret"));
    } catch (error) {
        await fails(context, error.message);
    }

    await context.events.emit("api-token:check", context, payload);

    if (!payload || !payload.apiTokenId) {
        await context.events.emit("api-token:check fails", context);

        await fails(context);
    }

    const apiToken = await mongodb.collection("apiTokens").findOne({
        _id: ObjectId(payload.apiTokenId),
        deletedAt: {$eq: null}
    });

    if (!apiToken) {
        await context.events.emit("api-token:check fails", context);

        await fails(context);
    }

    context.state.apiToken = apiToken;

    await context.events.emit("api-token:check succeed", context);

    await next();

};