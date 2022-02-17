"use strict";

const mongodb = require("../modules/mongodb");

const listeners = require("./settings");

module.exports = async app => {

    // Caching settings
    const result = await mongodb.collection("settings").find({deletedAt: {$eq: null}});
    const settings = await result.toArray();

    app.use(async (context, next) => {

        context.events.on("settings:loaded", listeners.loaded);
        context.events.on("api:settings created", listeners.changed);
        context.events.on("api:settings updated", listeners.changed);
        context.events.on("api:settings deleted", listeners.changed);
        context.events.on("admin:settings created", listeners.changed);
        context.events.on("admin:settings updated", listeners.changed);
        context.events.on("admin:settings deleted", listeners.changed);

        // Passing settings to state
        context.state.settings = settings;

        await context.events.emit("settings:loaded", context);

        context.events.on("session:check succeed", async context => {

            const session = context.state.session;

            // Update session last activity and refresh the state
            await mongodb.collection("sessions").updateOne({_id: session._id}, {$set: {lastActivityAt: new Date()}});

            context.state.session = await mongodb.collection("sessions").findOne({_id: session.id}, {projection: {token: 0}});

        });

        await next();

    });

};