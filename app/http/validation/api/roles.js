"use strict";

const yup = require("yup");
const sortable = ["_id", "name", "label", "createdBy", "createdAt", "updatedAt", "updatedBy"];

const index = yup.object({

    page: yup.number().integer().min(1),
    perPage: yup.number().integer().min(1).max(1000),
    sortBy: yup.mixed().oneOf(sortable),
    sortDirection: yup.mixed().oneOf(["asc", "desc"])

});

const post = yup.object({

    name: yup.string().required().min(1).max(255),
    label: yup.string().required().min(1).max(255),
    super: yup.boolean().required(),
    createdAt: yup.date().nullable(),
    createdBy: yup.string().nullable()

});

const put = yup.object({

    name: yup.string().min(1).max(255),
    label: yup.string().min(1).max(255),
    super: yup.boolean(),
    updatedAt: yup.date().nullable(),
    updatedBy: yup.string().nullable()

});

const destroy = yup.object({

    deletedAt: yup.date().nullable(),
    deletedBy: yup.string().nullable()

});


module.exports = {

    index,
    post,
    put,
    delete: destroy

};