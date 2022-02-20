"use strict";

const yup = require("yup");
const sortable = ["_id", "name", "description", "readOnly", "createdBy", "createdAt", "updatedAt", "updatedBy"];

const index = yup.object({

    page: yup.number().integer().min(1),
    perPage: yup.number().integer().min(1).max(100),
    sortBy: yup.mixed().oneOf(sortable),
    sortDirection: yup.mixed().oneOf(["asc", "desc"]),

});

const post = yup.object({

    name: yup.string().required().min(1).max(255),
    description: yup.string().nullable().max(1024),
    readOnly: yup.boolean().required()

});

const put = yup.object({

    name: yup.string().min(1).max(255),
    description: yup.string().nullable().max(1024),
    readOnly: yup.boolean().required()

});

module.exports = {

    index,
    post,
    put

};