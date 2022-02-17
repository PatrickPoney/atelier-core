"use strict";

const env = require("../modules/helpers/env");

module.exports = {

    ipAddresses: JSON.parse(env("AUTH_IP_ADDRESSES", "[]")),
    sessionDuration: Number.parseInt(env("AUTH_SESSION_DURATION", 1)) // In minutes

};