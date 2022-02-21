"use strict";

const yup = require("yup");
const sortable = ["_id", "email", "identifier", "enabled", "super", "createdBy", "createdAt", "updatedAt", "updatedBy"];

const index = yup.object({

    page: yup.number().integer().min(1),
    perPage: yup.number().integer().min(1).max(1000),
    sortBy: yup.mixed().oneOf(sortable),
    sortDirection: yup.mixed().oneOf(["asc", "desc"]),

});

const post = yup.object({

    roleIds: yup.string().required().min(1).max(255),
    email: yup.string().required().max(320).email(),
    identifier: yup.string().required().min(1).max(255),
    password: yup.string().required().min(8).max(255),
    passwordConfirm: yup.mixed().required().match(yup.ref("password")),
    enabled: yup.boolean().required(),
    super: yup.boolean().required(),

});

const put = yup.object({

    roleIds: yup.string().min(1).max(255),
    email: yup.string().max(320).email(),
    identifier: yup.string().min(1).max(255),
    password: yup.string().min(8).max(255),
    passwordConfirm: yup.mixed().when("password", {
        is: value => !!value,
        then: yup.mixed().match(yup.ref("password"))
    }),
    enabled: yup.boolean(),
    super: yup.boolean()

});

module.exports = {

    index,
    post,
    put

};