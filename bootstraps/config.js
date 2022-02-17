"use strict";

const fsp = require("fs/promises");
const path = require("path");
const config = require("../app/modules/config");

module.exports = async app => {

    // Read directory content
    const files = await fsp.readdir(path.join(__dirname, "..", "app", "config"));

    for (let key in files) {
        let file = files[key];

        // We make sure it's a javascript file (just in case)
        if (file.endsWith(".js") === false) {
            continue;
        }

        // Load and inject file data into config
        config.set(file.substr(0, file.length - 3), require(path.join(__dirname, "..", "app", "config", file)));
    }

    // Setting a few important variables
    process.env.NODE_ENV = config.get("app.env");
    process.env.PORT = config.get("app.port");
    process.env.TZ = config.get("app.timezone");

};