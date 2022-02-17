"use strict";

const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const crypto = require("crypto");
const template = require("lodash/template");

let $baseDir = null;
let $compiledDir = null;

class ViewError extends Error {

    constructor(message, view) {
        super(`${message} [${view}]`);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.status = 500;
        this.view = view;
    }

    get statusCode() {
        return this.status;
    }

}

const isExpired = async view => {
    let stats;
    let compiled;

    try {
        stats = await fsp.stat(resolve(view));
    } catch (error) {
        return true;
    }

    try {
        compiled = await fsp.stat(resolveCompiled(view));
    } catch (error) {
        return true;
    }

    return stats.mtime >= compiled.mtime;
};

const resolve = view => {
    return path.join($baseDir, `${view}.html`);
};

const resolveCompiled = view => {
    return path.join($compiledDir, `${crypto.createHash("sha1").update(`${view}.html`).digest("hex")}.js`);
};

const exists = async view => {
    const filepath = resolve(view);

    try {
        await fsp.access(filepath, fs.constants.F_OK);
    } catch (error) {
        return false;
    }

    return true;
};

const render = async (view, data = {}) => {
    const hasExpired = await isExpired(view);
    const filepath = resolveCompiled(view);

    let compiled;
    let output;

    try {

        if (hasExpired) {
            let content = await fsp.readFile(resolve(view), "utf-8");

            // Compile view
            let result = template(content);

            await fsp.writeFile(filepath, `module.exports = ${result.source};`);

            // Clear cache
            delete require.cache[filepath];
        }

        compiled = require(filepath);

        output = compiled(data);

    } catch (error) {
        throw new ViewError(error.message, view);
    }

    return output;
};

module.exports = {

    get baseDir() {
        return $baseDir;
    },

    set baseDir(value) {
        $baseDir = value;
    },

    get compiledDir() {
        return $compiledDir;
    },

    set compiledDir(value) {
        $compiledDir = value;
    },

    exists,
    render

}