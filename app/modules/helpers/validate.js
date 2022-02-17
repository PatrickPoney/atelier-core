"use strict";

let resolve = (errors, e) => {

    if (!errors[e.path]) {
        errors[e.path] = [];
    }

    // errors[e.path] = errors[e.path].concat(e.errors.slice());
    errors[e.path].push(e.type);

    if (e.inner) {
        loop(errors, e);
    }

};

let loop = (errors, e) => {

    for (let i = 0; i < e.inner.length; i++) {
        resolve(errors, e.inner[i]);
    }

};

module.exports = async (schema, context, name) => {

    const input = ["POST", "PUT", "PATCH"].indexOf(context.method) !== -1 ? context.request.body : context.request.query;

    let validated;

    try {
        await context.events.emit("validate:schema", context, schema, input);

        if (name) {
            await context.events.emit(`validate:schema [${name}]`, context, schema, input);
        }

        validated = await schema.validate(input, {abortEarly: false});
    } catch (error) {
        const errors = {};

        loop(errors, error);

        await context.events.emit("validate:schema fails", context, schema, input, errors);

        if (name) {
            await context.events.emit(`validate:schema [${name}] fails`, context, schema, input, errors);
        }

        context.throw(422, `Invalid request: ${error.message}`, {errors});
    }

    await context.events.emit("validate:schema succeed", context, schema, input, validated);

    if (name) {
        await context.events.emit(`validate:schema [${name}] succeed`, context, schema, input, validated);
    }

    return validated;

};