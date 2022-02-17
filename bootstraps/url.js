"use strict";

const url = require("../app/modules/url");
const config = require("../app/modules/config");

module.exports = async app => {

    url.hostname = config.get("app.hostname");
    url.port = config.get("app.port");

};