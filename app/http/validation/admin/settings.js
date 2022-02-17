"use strict";

const yup = require("yup");
const sortable = ["_id", "name", "label", "value", "createdBy", "createdAt", "updatedAt", "updatedBy"];

const testDoesntExist = async (value) => {
    const mongodb = require("../../../modules/mongodb");
    const result = await mongodb.collection("settings").findOne({name: value, deletedAt: {$eq: null}}, {projection: {_id: 1}});

    return !result;
};

const index = yup.object({

    page: yup.number().integer().min(1),
    perPage: yup.number().integer().min(1).max(1000),
    sortBy: yup.mixed().oneOf(sortable),
    sortDirection: yup.mixed().oneOf(["asc", "desc"])

});

const post = yup.object({

    name: yup.string().required().min(1).max(255).test("doesntExist", "Value already in use.", testDoesntExist),
    label: yup.string().required().min(1).max(255),
    value: yup.mixed().nullable()

});

const put = yup.object({

    name: yup.string().min(1).max(255).test("doesntExist", "Value already in use.", testDoesntExist),
    label: yup.string().min(1).max(255),
    value: yup.mixed().nullable()

});

module.exports = {

    index,
    post,
    put

};