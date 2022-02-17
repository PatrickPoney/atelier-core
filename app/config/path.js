"use strict";

const path = require("path");

const rootDir = path.join(__dirname, "..", "..");

module.exports = {

    root: rootDir,

    app: path.join(rootDir, "app"),

    storage: {

        root: path.join(rootDir, "storage"),
        app: path.join(rootDir, "storage", "app"),
        cache: path.join(rootDir, "storage", "cache"),
        logs: path.join(rootDir, "storage", "logs"),
        tmp: path.join(rootDir, "storage", "tmp"),

    },

    views: path.join(rootDir, "app", "views"),

    public: path.join(rootDir, "public"),

};