"use strict";

const {ObjectId} = require("mongodb");
const authorization = require("auth-header");
const mongodb = require("../../modules/mongodb");
const config = require("../../modules/config");
const jwt = require("../../modules/jwt");

const fails = async (context, message) => {
    await context.events.emit("session:check fails", context);

    context.set("WWW-Authenticate", authorization.format("Bearer"));
    context.throw(message === "jwt expired" ? 440 : 401, message);
};

module.exports = async (context, next) => {

    const token = await jwt.getToken(context);

    if (token) {

        let payload;

        try {
            payload = await jwt.verify(token, {}, config.get("jwt.secret"));
        } catch (error) {
            await fails(context, error.message);
        }

        await context.events.emit("session:check", context, payload);

        if (payload && payload.userId && payload.sessionId) {

            context.state.user = await mongodb.collection("users").findOne({
                _id: ObjectId(payload.userId),
                enabled: true, // Exclude if user is disabled
                deletedAt: {$eq: null}
            }, {projection: {password: 0}});

            if (!context.state.user) {
                await fails(context);
            }

            context.state.session = await mongodb.collection("sessions").findOne({
                _id: ObjectId(payload.sessionId),
                userId: ObjectId(payload.userId),
                closed: {$eq: null}, // Exclude if session is closed
                token
            }, {projection: {token: 0}});

            // Invalid session
            if (!context.state.session) {
                await fails(context);
            }

            await context.events.emit("session:check succeed", context);

        }

    }

    await next();

};