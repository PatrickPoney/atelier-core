"use strict";

const compose = require("koa-compose");
const router = require("../modules/router");
const tap = require("../modules/helpers/tap");
const ip = require("../http/middlewares/ip");
const session = require("../http/middlewares/session");
const user = require("../http/middlewares/user");

module.exports = app => {

    const prefix = "admin";
    const secure = compose([ip, user]);
    const control = compose([ip, session]);

    router.get("api-tokens", compose([secure, tap("app/http/controllers/admin/api-tokens", "index")]), {prefix, name: "admin.apiTokens.index"});
    router.post("api-tokens", compose([secure, tap("app/http/controllers/admin/api-tokens", "post")]), {prefix, name: "admin.apiTokens.post"});
    router.get("api-tokens/{id}", compose([secure, tap("app/http/controllers/admin/api-tokens", "get")]), {prefix, name: "admin.apiTokens.get"});
    router.put("api-tokens/{id}", compose([secure, tap("app/http/controllers/admin/api-tokens", "put")]), {prefix, name: "admin.apiTokens.put"});
    router.delete("api-tokens/{id}", compose([secure, tap("app/http/controllers/admin/api-tokens", "delete")]), {prefix, name: "admin.apiTokens.delete"});

    router.get("settings", compose([secure, tap("app/http/controllers/admin/settings", "index")]), {prefix, name: "admin.settings.index"});
    router.post("settings", compose([secure, tap("app/http/controllers/admin/settings", "post")]), {prefix, name: "admin.settings.post"});
    router.get("settings/{id}", compose([secure, tap("app/http/controllers/admin/settings", "get")]), {prefix, name: "admin.settings.get"});
    router.put("settings/{id}", compose([secure, tap("app/http/controllers/admin/settings", "put")]), {prefix, name: "admin.settings.put"});
    router.delete("settings/{id}", compose([secure, tap("app/http/controllers/admin/settings", "delete")]), {prefix, name: "admin.settings.delete"});

    router.get("roles", compose([secure, tap("app/http/controllers/admin/roles", "index")]), {prefix, name: "admin.roles.index"});
    router.post("roles", compose([secure, tap("app/http/controllers/admin/roles", "post")]), {prefix, name: "admin.roles.post"});
    router.get("roles/{id}", compose([secure, tap("app/http/controllers/admin/roles", "get")]), {prefix, name: "admin.roles.get"});
    router.put("roles/{id}", compose([secure, tap("app/http/controllers/admin/roles", "put")]), {prefix, name: "admin.roles.put"});
    router.delete("roles/{id}", compose([secure, tap("app/http/controllers/admin/roles", "delete")]), {prefix, name: "admin.roles.delete"});

    router.get("users", compose([secure, tap("app/http/controllers/admin/users", "index")]), {prefix, name: "admin.users.index"});
    router.post("users", compose([secure, tap("app/http/controllers/admin/users", "post")]), {prefix, name: "admin.users.post"});
    router.get("users/{id}", compose([secure, tap("app/http/controllers/admin/users", "get")]), {prefix, name: "admin.users.get"});
    router.put("users/{id}", compose([secure, tap("app/http/controllers/admin/users", "put")]), {prefix, name: "admin.users.put"});
    router.delete("users/{id}", compose([secure, tap("app/http/controllers/admin/users", "delete")]), {prefix, name: "admin.users.delete"});

    router.get("sessions", compose([secure, tap("app/http/controllers/admin/sessions", "index")]), {prefix, name: "admin.sessions.index"});
    router.get("sessions/{id}", compose([secure, tap("app/http/controllers/admin/sessions", "get")]), {prefix, name: "admin.sessions.get"});
    router.post("sessions/{id}/close", compose([secure, tap("app/http/controllers/admin/sessions/close")]), {prefix, name: "admin.sessions.post.close"});

    router.post("auth/login", compose([control, tap("app/http/controllers/admin/auth", "login")]), {prefix, name: "auth.login"});
    router.post("auth/logout", compose([control, tap("app/http/controllers/admin/auth", "logout")]), {prefix, name: "auth.logout"});

};