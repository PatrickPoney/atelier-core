"use strict";

const index = async context => {
    //
};

const get = async context => {
    //
};

const close = async context => {
    const apiToken = context.state.apiToken;

    if (apiToken && apiToken.readOnly) {
        context.throw(403);
    }
};

module.exports = {

    index,
    get,
    close,

};