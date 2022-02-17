"use strict";

const config = require("../app/modules/config");
const path = require("path");
const fsp = require("fs/promises");
const fs = require("fs");

module.exports = async app => {

    if (!config.get("app.static")) {
        return;
    }

    const baseDir = config.get("path.public");
    
    app.use(async (context, next) => {
        const url = context.request.url;
        
        let serving = false;

        // This also ignores hidden file names like .env, .something etc.
        const extension = path.extname(url);

        // Only serving files and not indexing directories
        if (["GET", "HEAD"].indexOf(context.method) !== -1 && extension) {
            const resolved = path.join(baseDir, url);
            
            let stats;

            try {
                stats = await fsp.stat(resolved);

                serving = true;
            } catch (e) {
                if (["ENOENT", "ENAMETOOLONG"].indexOf(e.code) !== -1) {
                    context.throw(404);
                }

                throw e;
            }

            // Update headers
            context.set("Content-Length", stats.size);

            if (!context.response.get("Last-Modified")) {
                context.set("Last-Modified", stats.mtime.toUTCString());
            }

            if (!context.response.get("Cache-Control")) {
                context.set("Cache-Control", "no-cache");
            }

            if (!context.type) {
                context.type = extension;
            }

            context.body = fs.createReadStream(resolved);
        }

        if (!serving) {
            await next();
        }

    });

};