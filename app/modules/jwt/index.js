"use strict";

const authorization = require("auth-header");
const jwt = require("jsonwebtoken");

const getTokenPayload = async context => {
    const token = await getToken(context);

    if (token) {
        return await verify(token);
    }

    return null;
};

const getToken = async context => {
    const payload = context.get("Authorization");

    if (payload) {
        let auth;

        try {
            auth = authorization.parse(payload);
        } catch (e) {
            return null;
        }

        if (auth.scheme !== "Bearer") {
            return null;
        }

        return auth.token;
    }

    return null;
};

const issue = async (payload, options = {}, secret) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (error, token) => {
            if (error) {
                reject(error);
            }

            resolve(token);
        });
    });
};

const verify = async (token, options = {}, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, options, (error, tokenPayload = {}) => {
            if (error) {
                reject(error);
            }

            resolve(tokenPayload);
        });
    });
};

module.exports = {

    getToken,
    getTokenPayload,
    issue,
    verify

}