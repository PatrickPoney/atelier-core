"use strict";

const mongodb = require("../../../modules/mongodb");

const index = async context => {
    //
};

const post = async context => {
    const input = context.state.input;
    const role = context.state.role;

    // Only a super user can set another one
    if (!role.super) {
        const targetRole = mongodb.collection("roles").findOne({_id: input.roleId}, {projection: {super: true}});

        if (targetRole.super) {
            context.throw(403);
        }
    }
};

const get = async context => {
    //
};

const put = async context => {
    const input = context.state.input;
    const user = context.state.user;
    const role = context.state.role;
    const targetUser = context.state.document;

    // Can't disable self
    if (input.enabled === false && user._id.equals(targetUser._id)) {
        context.throw(403);
    }

    // Only a super user can set/unset another one
    if (!role.super && input.roleId) {
        const previousTargetRole = mongodb.collection("roles").findOne({_id: targetUser.roleId}, {projection: {super: true}});

        if (previousTargetRole.super) {
            context.throw(403);
        }

        const newTargetRole = mongodb.collection("roles").findOne({_id: input.roleId}, {projection: {super: true}});

        if (newTargetRole.super) {
            context.throw(403);
        }
    }
};

const destroy = async context => {
    const user = context.state.user;
    const role = context.state.role;
    const targetUser = context.state.document;

    // Can't delete self :)
    if (user._id.equals(targetUser._id)) {
        context.throw(403);
    }

    const targetRole = mongodb.collection("roles").findOne({_id: targetUser.roleId}, {projection: {super: true}});

    // Only a super user can delete another super user
    if (!role.super && targetRole.super) {
        context.throw(403);
    }
};

module.exports = {

    index,
    post,
    get,
    put,
    delete: destroy

};