"use strict";

const yup = require("yup");

module.exports = yup.object({

    closedAt: yup.date().nullable(),
    closedBy: yup.string().nullable()

});