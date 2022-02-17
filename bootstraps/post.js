"use strict";

const fsp = require("fs/promises");
const path = require("path");
const stream = require("stream");
const crypto = require("crypto");
const formidable = require("formidable");
const config = require("../app/modules/config");

module.exports = async app => {

    const uploadDir = config.get("path.storage.tmp");

    app.use(async (context, next) => {

        if (["POST", "PUT", "PATCH"].indexOf(context.request.method) !== -1) {

            const form = formidable({
                uploadDir,
                maxFileSize: config.get("app.maxFileSize") * 1024 * 1024,
                maxFieldsSize: config.get("app.maxFieldsSize") * 1024 * 1024
            });

            form.on("fileBegin", (name, file) => {
                const random = crypto.randomBytes(6).toString("hex");

                file.filepath = path.join(uploadDir, `upload_${Date.now()}_${random}`);
            });

            try {

                await new Promise((resolve, reject) => {
                    form.parse(context.req, (error, fields, files) => {
                        if (error) {
                            reject(error);
                        }

                        context.request.fields = fields;
                        context.request.files = files;

                        if (context.is("multipart")) {
                            context.request.body = Object.assign(fields, files);
                        }

                        resolve();
                    });
                });

            } catch (error) {
                context.throw(error.httpCode || 500);
            }

        }

        await next();

    });

    const cleanup = async (context) => {

        // Deleting uploaded files from the temp folder
        const files = Object.values(context.request.files || {});

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                await fsp.unlink(files[i].filepath);
            }
        }

    };

    app.on("error", async (error, context) => {

        await cleanup(context);

    });

    app.use(async (context, next) => {

        await next();

        // In case of a streamed response we want to do the cleanup after
        if (context.body instanceof stream.Stream) {

            context.body.on("error", async () => {
                await cleanup(context);
            });

            context.body.on("close", async () => {
                await cleanup(context);
            });

        } else {
            await cleanup(context);
        }

    });

};