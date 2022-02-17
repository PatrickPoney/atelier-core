"use strict";

const connection = require("../app/modules/mongodb/connection");
const config = require("../app/modules/config");

module.exports = async app => {

    const client = config.get("mongodb.client");
    const host = config.get("mongodb.host");
    const username = config.get("mongodb.username");
    const password = config.get("mongodb.password");

    connection.defaultDatabase = config.get("mongodb.database");

    // Connect to database
    await connection.connect(client, host, username, password);

};