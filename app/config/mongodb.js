"use strict";

const env = require("../modules/helpers/env");

module.exports = {

    client: env("MONGODB_CLIENT", "mongodb"),
    host: env("MONGODB_HOST", "localhost:27017"),
    username: env("MONGODB_USERNAME", "root"),
    password: env("MONGODB_PASSWORD", "root"),
    database: env("MONGODB_DATABASE", "app"),

};