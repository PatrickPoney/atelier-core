"use strict";

const mongodb = require("../../modules/mongodb");

module.exports = app => {

    const stream = mongodb.collection("settings").watch();

    stream.on("change", changes => {

        app.emit("mongodb:watcher:settings change", changes);
        app.emit(`mongodb:watcher:settings ${changes.operationType}`, changes);

    });

};