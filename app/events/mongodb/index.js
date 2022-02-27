"use strict";

const handler = changes => {
    console.log("--");
    console.log(`${changes.ns.coll} ${changes.operationType} ${changes.documentKey._id.toString()}`);
    console.log(JSON.stringify(changes.updateDescription));
    console.log("--");
};

module.exports = async app => {

    app.on("mongodb:watcher:apiTokens change", handler);
    app.on("mongodb:watcher:roles change", handler);
    app.on("mongodb:watcher:sessions change", handler);
    app.on("mongodb:watcher:settings change", handler);
    app.on("mongodb:watcher:users change", handler);

};