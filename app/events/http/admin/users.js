"use strict";

const mongodb = require("../../../modules/mongodb");
const loCloneDeep = require("lodash/cloneDeep");

const closeAllActiveSessions = async (userId, closedBy, closedAt) => {
    const _ids = await mongodb.collection("sessions").find({userId, closed: {$eq: null}}, {_id: 1}).map(item => item._id);

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
    const document = context.state.document;
    const originalDocument = context.state.originalDocument;

    // Find and close any active sessions when user is disabled
    if (originalDocument.enabled && !document.enabled) {
        const updatedAt = new Date();
        const updatedBy = context.state.user._id;

        await closeAllActiveSessions(document._id, updatedBy, updatedAt);
    }
};

const deleting = async context => {
    //
};

const deleted = async context => {
    // Find and close any active sessions when user is deleted
    const deletedAt = new Date();
    const deletedBy = context.state.user._id;

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