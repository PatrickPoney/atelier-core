"use strict";

const config = require("../../../modules/config");
const mongodb = require("../../../modules/mongodb");
const jwt = require("../../../modules/jwt");
const validate = require("../../../modules/helpers/validate");
const schema = require("../../validation/admin/auth");
const {ObjectId} = require("mongodb");
const {DateTime} = require("luxon");
const bcrypt = require("bcryptjs");
const platform = require("platform");
const loPick = require("lodash/pick");

const loginFails = async context => {
    await context.events.emit("admin:auth login fails", context);

    context.throw(403);
};

const login = async (context, next) => {

    const input = await validate(schema.login, context);

    context.state.input = input;

    await context.events.emit("admin:auth login", context);

    if (context.state.user) {
        await loginFails(context);
    }

    // Check document
    const document = await mongodb.collection("users").findOne({
        identifier: input.identifier,
        enabled: true,
        deletedAt: {$eq: null}
    });

    if (!document) {
        await loginFails(context);
    }

    // Check password
    const matches = await bcrypt.compare(input.password, document.password);

    if (!matches) {
        await loginFails(context);
    }

    // Cleanup
    delete document.password;

    context.state.user = document;

    // Parse user-agent
    const parsed = platform.parse(context.userAgent);

    const result = await mongodb.collection("sessions").insertOne({
        ip: context.state.ip,
        userId: context.state.user._id,
        userAgent: {
            source: context.userAgent,
            os: parsed.os.toString(),
            browser: parsed.name,
            browserVersion: parsed.version,
            deviceName: parsed.product
        },
        lastActivityAt: new Date(),
        createdAt: new Date()
    });

    const expiresInMinutes = config.get("auth.sessionDuration");

    const expiresDateTime = DateTime.local().plus({minutes: expiresInMinutes});

    const token = context.state.jwt = await jwt.issue({userId: document._id, sessionId: result.insertedId}, {expiresIn: `${expiresInMinutes} minutes`}, config.get("jwt.secret"));

    // Store token in session
    await mongodb.collection("sessions").updateOne({_id: result.insertedId}, {$set: {token}});

    context.state.session = await mongodb.collection("sessions").findOne({_id: ObjectId(result.insertedId)}, {projection: {token: 0}});

    await context.events.emit("admin:auth login succeed", context);

    context.status = 200;
    context.body = {
        jwt: token,
        jwtExpiresAt: expiresDateTime.toJSDate(),
        user: loPick(document, ["_id", "identifier"])
    };

    await next();

};

const logout = async (context, next) => {

    await context.events.emit("admin:auth logout", context);

    if (!context.state.user || !context.state.session) {
        await context.events.emit("admin:auth logout fails", context);

        context.throw(403);
    }

    // Invalidating session for user
    const values = {
        closed: true,
        closedBy: context.state.user._id,
        closedAt: new Date()
    };

    await mongodb.collection("sessions").updateOne({_id: context.state.session._id}, {$set: values});

    await context.events.emit("admin:auth logout succeed", context);

    context.status = 200;
    context.body = "";

    await next();

};

module.exports = {

    login,
    logout

};