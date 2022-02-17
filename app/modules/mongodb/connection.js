"use strict";

const {MongoClient} = require("mongodb");

let $client;
let $defaultDatabase;

const connect = async (client, host, username, password) => {
    const uri = `${client}://${username}:${password}@${host}?retryWrites=true&w=majority`;

    $client = await MongoClient.connect(uri);

    return $client;
};

const connectToDatabase = async (database, username, password, host, client) => {
    await connect(client, host, username, password);

    return $client.db(database);
};

const database = async (name = null) => {
    if (name === null) {
        name = $defaultDatabase;
    }

    if (!$client instanceof MongoClient) {
        throw new Error("Connection must be established first.");
    }

    return $client.db(name);
};

module.exports = {

    get defaultDatabase() {
        return $defaultDatabase;
    },

    set defaultDatabase(value) {
        $defaultDatabase = value;
    },

    get client() {
        return $client;
    },

    get db() {
        return $client.db($defaultDatabase);
    },

    connect,

    connectToDatabase,

    database,

};