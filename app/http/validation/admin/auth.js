"use strict";

const yup = require("yup");

const login = yup.object().shape({

    identifier: yup.string().required().min(1).max(255),
    password: yup.string().required().min(1).max(255)

});

module.exports = {

    login

};