"use strict";

const util = require("util");
const readline = require("readline");
const {stdin, stdout} = require("process");

(async () => {

    console.log("Script initiated.");

    // -----------------------------------------------------------------------------------------------------------------

    console.log("");

    const io = readline.createInterface({input: stdin, output: stdout});
    const question = util.promisify(io.question).bind(io);

    const name = await question("Name your api token (required): ");

    if (!name) {
        io.close();
        console.error("Name is required!");
        process.exit(1);
    }

    const description = await question("Maybe a description too? (optional): ");

    // -----------------------------------------------------------------------------------------------------------------

    const path = require("path");
    const app = require("../app");
    const jwt = require("../app/modules/jwt");
    const config = require("../app/modules/config");

    console.log("");

    await (async () => {

        const bootstraps = require("../bootstraps");

        for (let i = 0; i < bootstraps.length; i++) {
            const callable = require(path.join("../", bootstraps[i]));

            await callable(app);
        }

        console.log("App bootstrapped.");

    })();

    // -----------------------------------------------------------------------------------------------------------------

    await (async () => {

        const mongodb = require("../app/modules/mongodb");

        const result = await mongodb.collection("apiTokens").insertOne({
            name,
            description: description || null,
            createdAt: new Date()
        });

        const token = await jwt.issue({apiTokenId: result.insertedId}, {}, config.get("jwt.apiSecret"));

        await mongodb.collection("apiTokens").updateOne({_id: result.insertedId}, {$set: {token}});

        console.log("API token created.");
        console.log("With great power comes great responsibility...");
        console.log("");
        console.log(token);

    })();

    // -----------------------------------------------------------------------------------------------------------------

    process.exit(1);

})();