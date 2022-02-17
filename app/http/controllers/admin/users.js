"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const validate = require("../../../modules/helpers/validate");
const guard = require("../../../modules/helpers/guard");
const query = require("../../../modules/helpers/query");
const schema = require("../../validation/admin/users");
const loOmit = require("lodash/omit");
const loAssign = require("lodash/assign");
const loCloneDeep = require("lodash/cloneDeep");
const bcrypt = require("bcryptjs");

const index = async (context, next) => {

    const input = await validate(schema.index, context);

    context.state.input = input;

    await guard("admin:users index", context);

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

    await guard("admin:users post", context);

    await context.events.emit("admin:users creating", context);

    const values = loAssign(loCloneDeep(input), {
        roleId: ObjectId(input.roleId),
        createdAt: new Date(),
        createdBy: context.state.user._id,
        password: await bcrypt.hash(input.password, await bcrypt.genSalt())
    });

    const result = await mongodb.collection("users").insertOne(loOmit(values, ["passwordConfirm"]));

    const document = context.state.document = await mongodb.collection("users").findOne({_id: result.insertedId}, {password: 0});

    await context.events.emit("admin:users created", context);

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

    await guard("admin:users get", context);

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

    await guard("admin:users put", context);

    await context.events.emit("admin:users updating", context);

    const values = loAssign(loCloneDeep(input), {
        updatedAt: new Date(),
        updatedBy: context.state.user._id
    });

    if (values.password) {
        values.password = await bcrypt.hash(values.password, await bcrypt.genSalt());
    }

    if (values.roleId) {
        values.roleId = ObjectId(values.roleId);
    }

    await mongodb.collection("users").updateOne({_id}, {$set: loOmit(values, ["passwordConfirm"])});

    context.state.document = await mongodb.collection("users").findOne({_id}, {password: 0});

    await context.events.emit("admin:users updated", context);

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

    await guard("admin:users delete", context);

    await context.events.emit("admin:users deleting", context);

    const values = loAssign(loCloneDeep(input), {
        deletedAt: new Date(),
        deletedBy: context.state.user._id
    });

    await mongodb.collection("users").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("users").findOne({_id}, {password: 0});

    await context.events.emit("admin:users deleted", context);

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