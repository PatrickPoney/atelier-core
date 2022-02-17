"use strict";

const config = require("../app/modules/config");
const logger = require("../app/modules/logger");

module.exports = async app => {

    logger.baseDir = config.get("path.storage.logs");

    app.on("error", async (error, context) => {

        if (config.get("app.log") && error.status >= 500) {
            logger.error(error);
        }

    });

};