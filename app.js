"use strict";

const Koa = require("koa");
const EventEmitter = require("promise-events");
const app = new Koa();

app.use(async (context, next) => {

    // We need a new event bus tied to the context
    context.events = new EventEmitter();

    await next();

});

module.exports = app;