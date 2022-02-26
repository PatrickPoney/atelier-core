"use strict";

const handler = () => {
    console.log(arguments);
};

module.exports = async app => {

    app.on("mongodb:watcher:apiTokens change", handler);
    app.on("mongodb:watcher:roles change", handler);
    app.on("mongodb:watcher:sessions change", handler);
    app.on("mongodb:watcher:settings change", handler);
    app.on("mongodb:watcher:users change", handler);

};