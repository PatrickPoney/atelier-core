"use strict";

module.exports = (string, char = " ") => {
    if (string.charAt(string.length - 1) === char) {
        string = string.substr(0, string.length - 1);
    }

    return string;
};