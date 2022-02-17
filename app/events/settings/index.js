"use strict";

const config = require("../../modules/config");

const loFindIndex = require("lodash/findIndex");

const handlers = {
    "app.debug": async (context, document) => {
        config.set("app.debug", process.env.APP_DEBUG = document.value);
    },
    "app.timezone": async (context, document) => {
        config.set("app.timezone", process.env.TZ = process.env.APP_TIMEZONE = document.value);
    },
    "app.maxFileSize": async (context, document) => {
        config.set("app.maxFileSize", process.env.APP_MAX_FILE_SIZE = document.value);
    },
    "auth.ipAddresses": async (context, document) => {
        config.set("auth.ipAddresses", process.env.AUTH_IP_ADDRESSES = document.value);
    },
    "auth.sessionDuration": async (context, document) => {
        config.set("auth.sessionDuration", process.env.AUTH_SESSION_DURATION = document.value);
    }
};

const loaded = async context => {

    const settings = context.state.settings;

    for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        if (handlers.hasOwnProperty(setting.name)) {
            await handlers[setting.name](context, setting);
        }
    }

};

const changed = async context => {

    const settings = context.state.settings;
    const document = context.state.document;

    const index = loFindIndex(settings, {_id: document._id});

    // If setting deleted -> remove it from state and reload env/config
    if (document.deletedAt && Object.keys(handlers).indexOf(document.name) !== -1) {
        // Remove item from collection
        if (index !== -1) {
            settings.splice(index, 1);
        }

        const bootstrapEnv = require("../../../bootstraps/env");
        const bootstrapConfig = require("../../../bootstraps/config");

        await bootstrapEnv(context.app);
        await bootstrapConfig(context.app);

        await loaded(context);
    } else {
        // Update state and env/config
        if (index !== -1) {
            // Update item in collection
            settings.splice(index, 1, document);
        }

        // Apply handler if found
        if (handlers.hasOwnProperty(document.name)) {
            await handlers[document.name](context, document);
        }
    }

};

module.exports = {

    loaded,
    changed

};