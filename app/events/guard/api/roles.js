"use strict";

const handleReadOnlyApiToken = context => {
    const apiToken = context.state.apiToken;

    if (apiToken && apiToken.readOnly) {
        context.throw(403);
    }
};

const index = async context => {
    //
};

const post = async context => {
    handleReadOnlyApiToken(context);
};

const get = async context => {
    //
};

const put = async context => {
    handleReadOnlyApiToken(context);
};

const destroy = async context => {
    handleReadOnlyApiToken(context);
};

module.exports = {

    index,
    post,
    get,
    put,
    delete: destroy

};