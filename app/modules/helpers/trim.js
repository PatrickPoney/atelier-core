"use strict";

const trimStart = require("./trimStart");
const trimEnd = require("./trimEnd");

module.exports = (string, char = " ") => {
    string = trimStart(string, char);
    string = trimEnd(string, char);

    return string;
};