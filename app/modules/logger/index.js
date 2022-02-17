"use strict";

const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

let $baseDir = null;

const resolve = name => {
    return path.join($baseDir, `${name}.log`);
};

const exists = async filepath => {
    try {
        await fsp.access(filepath, fs.constants.F_OK);
    } catch (error) {
        return false;
    }

    return true;
};

const write = async (message, status) => {
    const dt = new Date();
    const content = `[${dt.toISOString()}]\n${message instanceof Error ? message.stack : message}`;
    const filepath = resolve(`${status}-${dt.toISOString().split("T")[0]}`);

    const fileExists = await exists(filepath);

    if (fileExists) {
        return fsp.appendFile(filepath, `\n\n${content}`);
    }

    return fsp.writeFile(filepath, content);
};

const logError = async (error) => {
    await write(error, "error");
};

const logWarning = async (error) => {
    await write(error, "warning");
};

const logInfo = async (error) => {
    await write(error, "info");
};

const log = async (error) => {
    let status = "error";
    // TODO: resolve status ?

    await write(error, status);
};

module.exports = {

    get baseDir() {
        return $baseDir;
    },

    set baseDir(value) {
        $baseDir = value;
    },

    error: logError,
    warning: logWarning,
    info: logInfo,
    log

}