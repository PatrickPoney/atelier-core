"use strict";

const loHas = require("lodash/has");
const loGet = require("lodash/get");
const loSet = require("lodash/set");
const loUnset = require("lodash/unset");
const loExtend = require("lodash/extend");

const values = {};

module.exports = {

    has(key) {
        return loHas(values, key);
    },

    get(key, defaultValue) {
        return loGet(values, key, defaultValue);
    },

    set(key, value) {
        loSet(values, key, value);
    },

    remove(key) {
        loUnset(values, key);
    },

    fill(data) {
        loExtend(values, data);
    },

    all() {
        return values;
    }

};