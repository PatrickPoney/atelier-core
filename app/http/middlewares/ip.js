"use strict";

const config = require("../../modules/config");

module.exports = async (context, next) => {

    await context.events.emit("ip:check", context);

    const addresses = config.get("auth.ipAddresses", []);

    if (addresses.length > 0 && addresses.indexOf(context.state.ip) === -1) {
        await context.events.emit("ip:check fails", context);

        context.throw(403);
    }

    await context.events.emit("ip:check succeed", context);

    await next();

};