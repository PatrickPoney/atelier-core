"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const validate = require("../../../modules/helpers/validate");
const guard = require("../../../modules/helpers/guard");
const query = require("../../../modules/helpers/query");
const schema = require("../../validation/api/roles");
const loAssign = require("lodash/assign");
const loCloneDeep = require("lodash/cloneDeep");

const index = async (context, next) => {

    const input = await validate(schema.index, context);

    context.state.input = input;

    await guard("api:roles index", context, false);

    const {filter, projection, limit, skip, sort} = query(input, 10, "createdAt");

    const result = await mongodb.collection("users").find(filter, projection).sort(sort).skip(skip).limit(limit);

    context.status = 200;
    context.body = {data: await result.toArray()};

    await next();

};

const post = async (context, next) => {

    const input = await validate(schema.post, context);

    context.state.input = input;

    await guard("api:roles post", context, false);

    await context.events.emit("api:roles creating", context);

    const values = loAssign(loCloneDeep(input), {
        createdAt: input.createdAt || new Date(),
        createdBy: input.createdBy ? ObjectId(input.createdBy) : (context.state.user ? context.state.user._id : null)
    });

    const result = await mongodb.collection("roles").insertOne(values);

    const document = context.state.document = await mongodb.collection("roles").findOne({_id: result.insertedId});

    await context.events.emit("api:roles created", context);

    context.status = 201;
    context.body = {data: document};

    await next();

};

const get = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("roles").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    context.state.document = document;

    await guard("api:roles get", context, false);

    context.status = 200;
    context.body = {data: document};

    await next();

};

const put = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("roles").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = await validate(schema.put, context);

    context.state.document = document;

    await guard("api:roles put", context, false);

    await context.events.emit("api:roles updating", context);

    const values = loAssign(loCloneDeep(input), {
        updatedAt: input.updatedAt || new Date(),
        updatedBy: input.updatedBy ? ObjectId(input.updatedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("roles").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("roles").findOne({_id});

    await context.events.emit("api:roles updated", context);

    context.status = 204;
    context.body = "";

    await next();

};

const destroy = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("roles").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = {};

    context.state.document = document;

    await guard("api:roles delete", context, false);

    await context.events.emit("api:roles deleting", context);

    const values = loAssign(loCloneDeep(input), {
        deletedAt: input.deletedAt || new Date(),
        deletedBy: input.deletedBy ? ObjectId(input.deletedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("roles").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("roles").findOne({_id});

    await context.events.emit("api:roles deleted", context);

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