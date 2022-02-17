"use strict";

const mongodb = require("../../modules/mongodb");

module.exports = app => {

    const stream = mongodb.collection("roles").watch();

    stream.on("change", changes => {

        app.emit("mongodb:watcher:roles change", changes);
        app.emit(`mongodb:watcher:roles ${changes.operationType}`, changes);

    });

};