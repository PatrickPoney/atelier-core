"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../../modules/mongodb");
const guard = require("../../../../modules/helpers/guard");

module.exports = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("sessions").findOne({_id}, {token: 0});

    if (!document) {
        context.throw(404);
    }

    if (document.closed) {
        context.throw(403);
    }

    context.state.input = {};
    context.state.document = document;

    await guard("admin:sessions close", context);

    await context.events.emit("admin:sessions closing", context);

    const values = {
        closed: true,
        closedAt: new Date(),
        closedBy: context.state.user._id
    };

    await mongodb.collection("sessions").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("sessions").findOne({_id}, {token: 0});

    await context.events.emit("admin:sessions closed", context);

    context.status = 204;
    context.body = "";

    await next();

};