"use strict";

const requestIp = require("request-ip");
const KoaHelmet = require("koa-helmet");

module.exports = async app => {

    app.use(KoaHelmet());

    app.use(async (context, next) => {

        context.state.ip = requestIp.getClientIp(context.request) || context.request.ip;

        await next();

    });

};