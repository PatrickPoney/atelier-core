"use strict";

const view = require("../../modules/view");
const get = require("lodash/get");

const index = async (context, next) => {

    let name = get(context.state.params, "name", "World");

    context.body = await view.render("home", {name});

    await next();

};

module.exports = {

    index

};