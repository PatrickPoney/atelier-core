"use strict";

const router = require("../modules/router");
const tap = require("../modules/helpers/tap");

module.exports = app => {

    router.get("/", tap("app/http/controllers/home", "index"));
    router.get("hello/{name}", tap("app/http/controllers/home", "index"));

};