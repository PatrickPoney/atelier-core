"use strict";

const compose = require("koa-compose");
const router = require("../modules/router");
const tap = require("../modules/helpers/tap");
const auth = require("../http/middlewares/api-token");

module.exports = app => {

    const prefix = "api";

    router.get("settings", compose([auth, tap("app/http/controllers/api/settings", "index")]), {prefix, name: "api.settings.index"});
    router.post("settings", compose([auth, tap("app/http/controllers/api/settings", "post")]), {prefix, name: "api.settings.post"});
    router.get("settings/{id}", compose([auth, tap("app/http/controllers/api/settings", "get")]), {prefix, name: "api.settings.get"});
    router.put("settings/{id}", compose([auth, tap("app/http/controllers/api/settings", "put")]), {prefix, name: "api.settings.put"});
    router.delete("settings/{id}", compose([auth, tap("app/http/controllers/api/settings", "delete")]), {prefix, name: "api.settings.delete"});

    router.get("roles", compose([auth, tap("app/http/controllers/api/roles", "index")]), {prefix, name: "api.roles.index"});
    router.post("roles", compose([auth, tap("app/http/controllers/api/roles", "post")]), {prefix, name: "api.roles.post"});
    router.get("roles/{id}", compose([auth, tap("app/http/controllers/api/roles", "get")]), {prefix, name: "api.roles.get"});
    router.put("roles/{id}", compose([auth, tap("app/http/controllers/api/roles", "put")]), {prefix, name: "api.roles.put"});
    router.delete("roles/{id}", compose([auth, tap("app/http/controllers/api/roles", "delete")]), {prefix, name: "api.roles.delete"});

    router.get("users", compose([auth, tap("app/http/controllers/api/users", "index")]), {prefix, name: "api.users.index"});
    router.post("users", compose([auth, tap("app/http/controllers/api/users", "post")]), {prefix, name: "api.users.post"});
    router.get("users/{id}", compose([auth, tap("app/http/controllers/api/users", "get")]), {prefix, name: "api.users.get"});
    router.put("users/{id}", compose([auth, tap("app/http/controllers/api/users", "put")]), {prefix, name: "api.users.put"});
    router.delete("users/{id}", compose([auth, tap("app/http/controllers/api/users", "delete")]), {prefix, name: "api.users.delete"});

    router.get("sessions", compose([auth, tap("app/http/controllers/api/sessions", "index")]), {prefix, name: "api.sessions.index"});
    router.get("sessions/{id}", compose([auth, tap("app/http/controllers/api/sessions", "get")]), {prefix, name: "api.sessions.get"});
    router.post("sessions/{id}/close", compose([auth, tap("app/http/controllers/api/sessions/close")]), {prefix, name: "api.sessions.post.close"});

};