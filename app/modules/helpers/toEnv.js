"use strict";

module.exports = object => {

    return Object.keys(object).map(key => {
        const value = object[key];
        let str = "";

        switch (typeof value) {
            case "string":
                try {
                    JSON.parse(value);
                    str = value;
                } catch (e) {
                    str = /[\s"']/.test(value) ? JSON.stringify(value) : value;
                }
                break

            case "boolean":
            case "number":
                str = String(value);
                break

            case "undefined":
                str = "";
                break

            case "object":
                str = value !== null ? JSON.stringify(value) : str;
                break
        }

        return `${key}=${str}`;
    }).join("\n");

}
