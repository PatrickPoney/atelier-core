"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const validate = require("../../../modules/helpers/validate");
const guard = require("../../../modules/helpers/guard");
const query = require("../../../modules/helpers/query");
const schema = require("../../validation/api/sessions");

const index = async (context, next) => {

    const input = await validate(schema.index, context);

    context.state.input = input;

    await guard("api:sessions index", context, false);

    const {filter, projection, limit, skip, sort} = query(input, 10, "createdAt");

    projection.token = 0;

    const result = await mongodb.collection("users").find(filter, projection).sort(sort).skip(skip).limit(limit);

    context.status = 200;
    context.body = {data: await result.toArray()};

    await next();

};

const get = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("sessions").findOne({_id}, {token: 0});

    if (!document) {
        context.throw(404);
    }

    await guard("api:sessions get", context, false);

    context.status = 200;
    context.body = {data: document};

    await next();

};

module.exports = {

    index,
    get

};