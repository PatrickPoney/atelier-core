"use strict";

module.exports = (string, char = " ") => {
    if (string.charAt(0) === char) {
        string = string.substr(1, string.length - 1);
    }

    return string;
};