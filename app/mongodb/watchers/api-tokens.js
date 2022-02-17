"use strict";

const mongodb = require("../../modules/mongodb");

module.exports = app => {

    const stream = mongodb.collection("apiTokens").watch();

    stream.on("change", changes => {

        app.emit("mongodb:watcher:apiTokens change", changes);
        app.emit(`mongodb:watcher:apiTokens ${changes.operationType}`, changes);

    });

};