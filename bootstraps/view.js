"use strict";

const path = require("path");
const view = require("../app/modules/view");
const config = require("../app/modules/config");

module.exports = async app => {

    view.baseDir = config.get("path.views");
    view.compiledDir = path.join(config.get("path.storage.cache"), "views");

};