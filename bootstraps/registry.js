"use strict";

const fsp = require("fs/promises");
const path = require("path");
const config = require("../app/modules/config");

module.exports = async app => {

    // Read directory content
    const basePath = config.get("path.app");
    const dirName = "registry";
    const files = await fsp.readdir(path.join(basePath, dirName));

    for (let key in files) {
        const file = files[key];

        // We make sure it's a javascript file (just in case)
        if (file.endsWith(".js") === false) {
            continue;
        }

        const callable = require(path.join(basePath, dirName, file));

        await callable(app);
    }

};