"use strict";

const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcryptjs");
const fsp = require("fs/promises");
const dotenv = require("dotenv");

const app = require("../app");
const toEnv = require("../app/modules/helpers/toEnv");

(async () => {

    console.log("Script initiated.");

    // -----------------------------------------------------------------------------------------------------------------

    await (async () => {

        const envPath = path.join(__dirname, "../", ".env");
        const envStr = await fsp.readFile(envPath, "utf-8");
        const values = dotenv.parse(envStr);

        values.JWT_SECRET = crypto.randomBytes(128).toString("base64");
        values.JWT_API_SECRET = crypto.randomBytes(128).toString("base64");

        await fsp.writeFile(envPath, toEnv(values));

        console.log("Secret keys generated.");

    })();

    // -----------------------------------------------------------------------------------------------------------------

    await (async () => {

        const bootstraps = require("../bootstraps");

        for (let i = 0; i < bootstraps.length; i++) {
            const callable = require(path.join("../", bootstraps[i]));

            await callable(app);
        }

        console.log("App bootstrapped.");

    })();

    // -----------------------------------------------------------------------------------------------------------------

    let roleId;

    await (async () => {

        const mongodb = require("../app/modules/mongodb");

        const result = await mongodb.collection("roles").insertOne({
            name: "admin",
            label: "Administrator",
            createdAt: new Date()
        });

        roleId = result.insertedId;

        console.log("Admin role created.");

    })();

    // -----------------------------------------------------------------------------------------------------------------

    await (async () => {

        const mongodb = require("../app/modules/mongodb");

        const identifier = "admin";
        const password = "password"; // TODO: generate random password

        await mongodb.collection("users").insertOne({
            roleId,
            identifier: "admin",
            password: await bcrypt.hash(password, await bcrypt.genSalt()),
            enabled: true,
            super: true,
            createdAt: new Date()
        });

        console.log("Admin user created.");
        console.log("");
        console.log(`Identifier: ${identifier}`);
        console.log(`Password: ${password}`);

    })();

    console.log("");
    console.log("Setup done.");

    // -----------------------------------------------------------------------------------------------------------------

    process.exit(1);

})();