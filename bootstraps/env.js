"use strict";

const dotenv = require("dotenv");
const path = require("path");

module.exports = async app => {

    const results = dotenv.config({
        path: path.join(__dirname, "..", ".env")
    });

    if (results.error) {
        throw results.error;
    }

};