"use strict";

const statuses = require("statuses");
const config = require("../app/modules/config");
const view = require("../app/modules/view");

module.exports = async app => {

    app.use(async (context, next) => {

        try {
            await next();
        } catch (error) {
            error.status = error.statusCode || error.status || 500;

            let debug = config.get("app.debug");

            switch (context.accepts("html", "text", "json")) {
                case "json":

                    context.type = "application/json";
                    context.body = {
                        status: error.status,
                        message: error.expose ? error.message : statuses(error.status)
                    };

                    if (error.errors) {
                        context.body.errors = error.errors;
                    }

                    // Pushing error stack into json response
                    if (debug) {
                        context.body.debug = error.stack;
                    }

                    break;
                case "html":

                    context.type = "text/html";

                    // Showing error stack in browser
                    if (debug) {
                        context.body = `<!DOCTYPE html><html lang="en"><head><title>${statuses(error.status)}</title></head><body><pre>${error.stack}</pre></body></html>`;
                    } else {
                        // Check if there is a view for the current error status
                        let exists = await view.exists(`errors/${error.status}`);

                        // Then if it's the case render the view
                        // And inject it to the response body
                        if (exists) {
                            context.body = await view.render(`errors/${error.status}`, {error, context});
                        } else {
                            context.type = "text/plain";
                            context.body = error.expose ? error.message : statuses(error.status);
                        }
                    }

                    break;
                case "text":
                default:

                    context.type = "text/plain";

                    // Showing error stack in browser
                    if (debug) {
                        context.body = error.stack;
                    } else {
                        context.body = error.expose ? error.message : statuses(error.status);
                    }

                    break;
            }

            context.status = error.status;

            context.app.emit("error", error, context);
        }

    });

};