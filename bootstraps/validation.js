"use strict";

const yup = require("yup");
const config = require("../app/modules/config");
const Reference = require("yup/lib/Reference");
const {File} = require("formidable");

module.exports = async app => {

    // File validation
    yup.addMethod(yup.mixed, 'file', function (mimeTypes = ["*"], maxFileSize) {
        return this.test("fileType", "Wrong file type", (value = new File) => {
            return mimeTypes === ["*"] || mimeTypes.indexOf(value.type) !== -1;
        }).test("fileSize", "File is too large", (value = new File) => {
            if (Number.isNaN(value.size)) {
                return true;
            }

            return value.size < ((maxFileSize || config.get("app.maxFileSize")) * 1024 * 1024);
        });
    });

    yup.addMethod(yup.mixed, 'match', function (input) {
        const path = Reference.default.isRef(input) ? input.path : input;

        return this.test("match", `Value must match ${path}`, function (value) {
            return value === (Reference.default.isRef(input) ? this.resolve(input) : input);
        });
    });

};