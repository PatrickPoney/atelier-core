"use strict";

const app = require("./app");

(async () => {

    const bootstraps = require("./bootstraps");

    for (let i = 0; i < bootstraps.length; i++) {
        const callable = require(bootstraps[i]);

        await callable(app);
    }

    const config = require("./app/modules/config");

    const port = config.get("app.port");

    app.listen(port);

    console.log(`App is listening at port:${port}`);

})();