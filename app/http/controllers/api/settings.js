"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const validate = require("../../../modules/helpers/validate");
const guard = require("../../../modules/helpers/guard");
const query = require("../../../modules/helpers/query");
const schema = require("../../validation/api/settings");
const loAssign = require("lodash/assign");
const loCloneDeep = require("lodash/cloneDeep");

const index = async (context, next) => {

    const input = await validate(schema.index, context, "api:settings index");

    context.state.input = input;

    await guard("api:settings index", context);

    const {filter, projection, limit, skip, sort} = query(input, 10, "createdAt");

    const result = await mongodb.collection("settings").find(filter, projection).sort(sort).skip(skip).limit(limit);

    context.status = 200;
    context.body = {data: await result.toArray()};

    await next();

};

const post = async (context, next) => {

    const input = await validate(schema.post, context, "api:settings post");

    context.state.input = input;

    await guard("api:settings post", context);

    await context.events.emit("api:settings creating", context);

    const values = loAssign(loCloneDeep(input), {
        createdAt: input.createdAt || new Date(),
        createdBy: input.createdBy ? ObjectId(input.createdBy) : (context.state.user ? context.state.user._id : null)
    });

    const result = await mongodb.collection("settings").insertOne(values);

    const document = context.state.document = await mongodb.collection("settings").findOne({_id: result.insertedId});

    await context.events.emit("api:settings created", context);

    context.status = 201;
    context.body = {data: document};

    await next();

};

const get = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("settings").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    context.state.document = document;

    await guard("api:settings get", context);

    context.status = 200;
    context.body = {data: document};

    await next();

};

const put = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("settings").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = await validate(schema.put, context, "api:settings put");

    context.state.document = document;

    await guard("api:settings put", context);

    await context.events.emit("api:settings updating", context);

    const values = loAssign(loCloneDeep(input), {
        updatedAt: input.updatedAt || new Date(),
        updatedBy: input.updatedBy ? ObjectId(input.updatedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("settings").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("settings").findOne({_id});

    await context.events.emit("api:settings updated", context);

    context.status = 204;
    context.body = "";

    await next();

};

const destroy = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("settings").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = {};

    context.state.document = document;

    await guard("api:settings delete", context);

    await context.events.emit("api:settings deleting", context);

    const values = loAssign(loCloneDeep(input), {
        deletedAt: input.deletedAt || new Date(),
        deletedBy: input.deletedBy ? ObjectId(input.deletedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("settings").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("settings").findOne({_id});

    await context.events.emit("api:settings deleted", context);

    context.status = 204;
    context.body = "";

    await next();

};

module.exports = {

    index,
    post,
    get,
    put,
    delete: destroy

};