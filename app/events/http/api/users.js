"use strict";

const {ObjectId} = require("mongodb");
const mongodb = require("../../../modules/mongodb");
const loCloneDeep = require("lodash/cloneDeep");

const closeAllActiveSessions = async (userId, closedBy, closedAt) => {
    const _ids = await mongodb.collection("sessions").find({userId: userId, closed: {$eq: null}}, {_id: 1}).map(item => item._id);

    if (_ids.length > 0) {
        await mongodb.collection("sessions").updateMany({_id: {$in: _ids}, $set: {closed: true, closedAt, closedBy}});
    }
}

const creating = async context => {
    //
};

const created = async context => {
    //
};

const updating = async context => {
    context.state.originalDocument = loCloneDeep(context.state.document);
};

const updated = async context => {
    const input = context.state.input;
    const document = context.state.document;
    const originalDocument = context.state.originalDocument;

    // Find and close any active sessions when user is disabled
    if (originalDocument.enabled && !document.enabled) {
        const updatedAt = input.updatedAt || new Date();
        const updatedBy = input.updatedBy ? ObjectId(input.updatedBy) : (context.state.user ? context.state.user._id : null);

        await closeAllActiveSessions(document._id, updatedBy, updatedAt);
    }
};

const deleting = async context => {
    //
};

const deleted = async context => {
    const input = context.state.input;

    // Find and close any active sessions when user is deleted
    const deletedAt = input.deletedAt || new Date();
    const deletedBy = input.deletedBy ? ObjectId(input.deletedBy) : (context.state.user ? context.state.user._id : null);

    await closeAllActiveSessions(context.state.document._id, deletedBy, deletedAt);
};

module.exports = {

    creating,
    created,
    updating,
    updated,
    deleting,
    deleted

};