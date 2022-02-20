"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../../modules/mongodb");
const validate = require("../../../../modules/helpers/validate");
const guard = require("../../../../modules/helpers/guard");
const schema = require("../../../validation/api/sessions/close");

module.exports = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("sessions").findOne({_id}, {token: 0});

    if (!document) {
        context.throw(404);
    }

    if (document.closed) {
        context.throw(403);
    }

    const input = context.state.input = await validate(schema, context);

    context.state.document = document;

    await guard("api:sessions close", context);

    await context.events.emit("api:sessions closing", context);

    const values = {
        closed: true,
        closedAt: input.closedAt || new Date(),
        closedBy: input.closedBy ? ObjectId(input.closedBy) : (context.state.user ? context.state.user._id : null)
    };

    await mongodb.collection("sessions").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("sessions").findOne({_id}, {token: 0});

    await context.events.emit("api:sessions closed", context);

    context.status = 204;
    context.body = "";

    await next();

};