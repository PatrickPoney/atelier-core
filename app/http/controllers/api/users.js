"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const validate = require("../../../modules/helpers/validate");
const guard = require("../../../modules/helpers/guard");
const query = require("../../../modules/helpers/query");
const schema = require("../../validation/api/users");
const loOmit = require("lodash/omit");
const loAssign = require("lodash/assign");
const loCloneDeep = require("lodash/cloneDeep");
const bcrypt = require("bcryptjs");

const index = async (context, next) => {

    const input = await validate(schema.index, context);

    context.state.input = input;

    await guard("api:users index", context, false);

    const {filter, projection, limit, skip, sort} = query(input, 10, "createdAt");

    projection.password = 0;

    const result = await mongodb.collection("users").find(filter, projection).sort(sort).skip(skip).limit(limit);

    context.status = 200;
    context.body = {data: await result.toArray()};

    await next();

};

const post = async (context, next) => {

    const input = await validate(schema.post, context);

    context.state.input = input;

    await guard("api:users post", context, false);

    await context.events.emit("api:users creating", context);

    const values = loAssign(loCloneDeep(input), {
        roleIds: input.roleIds.length > 0 ? input.roleIds.map(value => ObjectId(value)) : null,
        createdAt: input.createdAt || new Date(),
        createdBy: input.createdBy ? ObjectId(input.createdBy) : (context.state.user ? context.state.user._id : null),
        password: await bcrypt.hash(input.password, await bcrypt.genSalt())
    });

    const result = await mongodb.collection("users").insertOne(loOmit(values, ["passwordConfirm"]));

    const document = context.state.document = await mongodb.collection("users").findOne({_id: result.insertedId}, {password: 0});

    await context.events.emit("api:users created", context);

    context.status = 201;
    context.body = {data: document};

    await next();

};

const get = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("users").findOne({_id, deletedAt: {$eq: null}}, {password: 0});

    if (!document) {
        context.throw(404);
    }

    await guard("api:users get", context, false);

    context.status = 200;
    context.body = {data: document};

    await next();

};

const put = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("users").findOne({_id, deletedAt: {$eq: null}}, {password: 0});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = await validate(schema.put, context);

    context.state.document = document;

    await guard("api:users put", context, false);

    await context.events.emit("api:users updating", context);

    const values = loAssign(loCloneDeep(input), {
        updatedAt: input.updatedAt || new Date(),
        updatedBy: input.updatedBy ? ObjectId(input.updatedBy) : (context.state.user ? context.state.user._id : null)
    });

    if (values.password) {
        values.password = await bcrypt.hash(values.password, await bcrypt.genSalt());
    }

    if (values.hasOwnProperty("roleIds")) {
        values.roleIds = values.roleIds.length > 0 ? values.roleIds.map(value => ObjectId(value)) : null;
    }

    await mongodb.collection("users").updateOne({_id}, {$set: loOmit(values, ["passwordConfirm"])});

    context.state.document = await mongodb.collection("users").findOne({_id}, {password: 0});

    await context.events.emit("api:users updated", context);

    context.status = 204;
    context.body = "";

    await next();

};

const destroy = async (context, next) => {

    const _id = ObjectId(context.state.params.id);

    const document = await mongodb.collection("users").findOne({_id, deletedAt: {$eq: null}}, {password: 0});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = {};

    context.state.document = document;

    await guard("api:users delete", context, false);

    await context.events.emit("api:users deleting", context);

    const values = loAssign(loCloneDeep(input), {
        deletedAt: input.deletedAt || new Date(),
        deletedBy: input.deletedBy ? ObjectId(input.deletedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("users").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("users").findOne({_id}, {password: 0});

    await context.events.emit("api:users deleted", context);

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