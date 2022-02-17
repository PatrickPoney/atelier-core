"use strict";

const env = require("../modules/helpers/env");

module.exports = {

    secret: env("JWT_SECRET"),
    apiSecret: env("JWT_API_SECRET"),

};