"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const config = require("../../../modules/config");
const jwt = require("../../../modules/jwt");
const validate = require("../../../modules/helpers/validate");
const guard = require("../../../modules/helpers/guard");
const query = require("../../../modules/helpers/query");
const schema = require("../../validation/admin/api-tokens");
const loAssign = require("lodash/assign");
const loCloneDeep = require("lodash/cloneDeep");

const index = async (context, next) => {

    const input = await validate(schema.index, context);

    context.state.input = input;

    await guard("admin:apiTokens index", context);

    const {filter, projection, limit, skip, sort} = query(input, 10, "createdAt");

    projection.token = 0;

    const result = await mongodb.collection("apiTokens").find(filter, projection).sort(sort).skip(skip).limit(limit);

    context.status = 200;
    context.body = {data: await result.toArray()};

    await next();

};

const post = async (context, next) => {

    const input = await validate(schema.post, context);

    context.state.input = input;

    await guard("admin:apiTokens post", context);

    await context.events.emit("admin:apiTokens creating", context);

    const values = loAssign(loCloneDeep(input), {
        createdAt: new Date(),
        createdBy: context.state.user._id
    });

    const result = await mongodb.collection("apiTokens").insertOne(values);

    const document = context.state.document = await mongodb.collection("apiTokens").findOne({_id: result.insertedId});

    const token = await jwt.issue({apiTokenId: result.insertedId}, {}, config.get("jwt.apiSecret"));

    await mongodb.collection("apiTokens").updateOne({_id: result.insertedId}, {$set: {token}});

    document.token = token;

    await context.events.emit("admin:apiTokens created", context);

    context.status = 201;
    context.body = {data: document};

    await next();

};

const get = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("apiTokens").findOne({_id, deletedAt: {$eq: null}}, {token: 0});

    if (!document) {
        context.throw(404);
    }

    await guard("admin:apiTokens get", context);

    context.status = 200;
    context.body = {data: document};

    await next();

};

const put = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("apiTokens").findOne({_id, deletedAt: {$eq: null}}, {token: 0});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = await validate(schema.put, context);

    context.state.document = document;

    await guard("admin:apiTokens put", context);

    await context.events.emit("admin:apiTokens updating", context);

    const values = loAssign(loCloneDeep(input), {
        updatedAt: new Date(),
        updatedBy: context.state.user._id
    });

    await mongodb.collection("apiTokens").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("apiTokens").findOne({_id}, {token: 0});

    await context.events.emit("admin:apiTokens updated", context);

    context.status = 204;
    context.body = "";

    await next();

};

const destroy = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("apiTokens").findOne({_id, deletedAt: {$eq: null}}, {token: 0});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = {};

    context.state.document = document;

    await guard("admin:apiTokens delete", context);

    await context.events.emit("admin:apiTokens deleting", context);

    const values = loAssign(loCloneDeep(input), {
        deletedAt: new Date(),
        deletedBy: context.state.user._id
    });

    await mongodb.collection("apiTokens").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("apiTokens").findOne({_id}, {token: 0});

    await context.events.emit("admin:apiTokens deleted", context);

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