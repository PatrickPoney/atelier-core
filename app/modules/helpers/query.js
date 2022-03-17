"use strict";

module.exports = (input, defaultPerPage = 10, defaultSortBy = "createdAt", defaultSortDirection = "desc") => {
    const limit = input.perPage || defaultPerPage;
    const sortBy = input.sortBy || defaultSortBy;
    const sortDirection = (input.sortDirection || defaultSortDirection) === "asc" ? 1 : -1;

    return {
        filter: {deletedAt: {$eq: null}},
        projection: {deletedBy: 0, deletedAt: 0},
        limit,
        skip: ((input.page || 1) - 1) * limit,
        sortBy,
        sortDirection,
        sort: {[sortBy]: sortDirection}
    };
};