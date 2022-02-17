"use strict";

const env = require("../modules/helpers/env");

module.exports = {

    env: env("APP_ENV", "development"),
    hostname: env("APP_HOSTNAME", "localhost"),
    port: Number.parseInt(env("APP_PORT", 3000)),
    timezone: env("APP_TIMEZONE", "UTC"),
    debug: env("APP_DEBUG", false),
    log: env("APP_LOG", false),
    maxFileSize: Number.parseInt(env("APP_MAX_FILE_SIZE", 2)), // In MB
    maxFieldsSize: Number.parseInt(env("APP_MAX_FIELD_SIZE", 16)), // In MB
    static: env("APP_STATIC", false)

};