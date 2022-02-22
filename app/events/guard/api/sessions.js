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
        return false;
    }
};

module.exports = {

    index,
    get,
    close,

};