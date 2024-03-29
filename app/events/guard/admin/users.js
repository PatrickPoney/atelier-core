"use strict";

const index = async context => {
    //
};

const post = async context => {
    const input = context.state.input;

    // Only a super user can set another one
    if (!user.super && input.super === true) {
        return false;
    }
};

const get = async context => {
    //
};

const put = async context => {
    const input = context.state.input;
    const user = context.state.user;
    const targetUser = context.state.document;

    // Can't disable self
    if (input.enabled === false && user._id.equals(targetUser._id)) {
        return false;
    }

    // Only a super user can set/unset another one
    if (!user.super && typeof input.super === "boolean") {
        if ((!targetUser.super && input.super) || (targetUser.super && !input.super)) {
            return false;
        }
    }
};

const destroy = async context => {
    const user = context.state.user;
    const targetUser = context.state.document;

    // Can't delete self :)
    if (user._id.equals(targetUser._id)) {
        return false;
    }

    // Only a super user can delete another super user
    if (!user.super && targetUser.super) {
        return false;
    }
};

module.exports = {

    index,
    post,
    get,
    put,
    delete: destroy

};