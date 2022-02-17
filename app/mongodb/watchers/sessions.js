"use strict";

const mongodb = require("../../modules/mongodb");

module.exports = app => {

    const stream = mongodb.collection("sessions").watch();

    stream.on("change", changes => {

        app.emit("mongodb:watcher:sessions change", changes);
        app.emit(`mongodb:watcher:sessions ${changes.operationType}`, changes);

    });

};