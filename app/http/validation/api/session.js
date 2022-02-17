"use strict";

const yup = require("yup");
const sortable = ["_id", "userId", "ip", "closed", "lastActivityAt", "createdAt", "closedAt", "closedBy"];

const index = yup.object({

    page: yup.number().integer().min(1),
    perPage: yup.number().integer().min(1).max(1000),
    sortBy: yup.mixed().oneOf(sortable),
    sortDirection: yup.mixed().oneOf(["asc", "desc"])

});

module.exports = {

    index

};