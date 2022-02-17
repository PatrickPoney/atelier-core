"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../modules/mongodb");
const validate = require("../modules/helpers/validate");
const guard = require("../modules/helpers/guard");
const query = require("../modules/helpers/query");
const schema = require("../http/validation/api/roles");
const loAssign = require("lodash/assign");
const loCloneDeep = require("lodash/cloneDeep");

const create = async (context, data) => {

    const input = await validate(schema.post, data || context);

    context.state.input = input;

    await guard("services:roles post", context);

    await context.events.emit("services:roles creating", context);

    const values = loAssign(loCloneDeep(input), {
        createdAt: input.createdAt || new Date(),
        createdBy: input.createdBy ? ObjectId(input.createdBy) : (context.state.user ? context.state.user._id : null)
    });

    const result = await mongodb.collection("roles").insertOne(values);

    const document = context.state.document = await mongodb.collection("roles").findOne({_id: result.insertedId});

    await context.events.emit("services:roles created", context);

    return document;

};

const update = async (oid, context, data) => {

    const _id = ObjectId(oid);

    const document = await mongodb.collection("roles").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = await validate(schema.put, data || context);

    context.state.document = document;

    await guard("services:roles put", context);

    await context.events.emit("services:roles updating", context);

    const values = loAssign(loCloneDeep(input), {
        updatedAt: input.updatedAt || new Date(),
        updatedBy: input.updatedBy ? ObjectId(input.updatedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("roles").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("roles").findOne({_id});

    await context.events.emit("services:roles updated", context);

    return document;

};

const destroy = async (oid, context) => {

    const _id = ObjectId(oid);

    const document = await mongodb.collection("roles").findOne({_id, deletedAt: {$eq: null}});

    if (!document) {
        context.throw(404);
    }

    const input = context.state.input = {};

    context.state.document = document;

    await guard("services:roles delete", context);

    await context.events.emit("services:roles deleting", context);

    const values = loAssign(loCloneDeep(input), {
        deletedAt: input.deletedAt || new Date(),
        deletedBy: input.deletedBy ? ObjectId(input.deletedBy) : (context.state.user ? context.state.user._id : null)
    });

    await mongodb.collection("roles").updateOne({_id}, {$set: values});

    context.state.document = await mongodb.collection("roles").findOne({_id});

    await context.events.emit("services:roles deleted", context);

    return document;

};

module.exports = {

    create,
    update,
    destroy

};