"use strict";

const mongodb = require("../../modules/mongodb");

module.exports = app => {

    const stream = mongodb.collection("users").watch();

    stream.on("change", changes => {

        app.emit("mongodb:watcher:users change", changes);
        app.emit(`mongodb:watcher:users ${changes.operationType}`, changes);

    });

};