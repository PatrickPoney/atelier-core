"use strict";

const yup = require("yup");
const validate = require("../../../modules/helpers/validate");
const timezones = require("../../../modules/helpers/timezones");

const postSchemas = {
    "app.debug": yup.boolean().required(),
    "app.timezone": yup.mixed().required().oneOf(timezones),
    "app.maxFileSize": yup.number().required().integer().min(1).max(500),
    "auth.ipAddresses": yup.array().required().of(yup.string().min(1).max(45)),
    "auth.sessionDuration": yup.number().required().integer().min(1),
};

const putSchemas = {
    "app.debug": yup.boolean(),
    "app.timezone": yup.mixed().oneOf(timezones),
    "app.maxFileSize": yup.number().integer().min(1).max(500),
    "auth.ipAddresses": yup.array().of(yup.string().min(1).max(45)),
    "auth.sessionDuration": yup.number().integer().min(1),
};

const post = async (context, schema, input, validated) => {
    if (postSchemas[validated.name]) {
        const result = await validate(yup.object({value: postSchemas[validated.name]}), context);

        validated.value = result.value;
    }
};

const put = async (context, schema, input, validated) => {
    if (putSchemas[validated.name]) {
        const result = await validate(yup.object({value: putSchemas[validated.name]}), context);

        validated.value = result.value;
    }
};

module.exports = {

    post,
    put

};