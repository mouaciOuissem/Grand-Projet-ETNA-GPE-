// MySQL.js (Config/Connector)
'use strict';

module.exports = {
    development: {
        username: process.env.SNL_SQL_USER,
        password: process.env.SNL_SQL_PASSWORD,
        database: process.env.SNL_SQL_DB,
        host: process.env.SNL_SQL_HOST,
        dialect: process.env.SNL_SQL_DIALECT,
    },
    test: {
        username: process.env.SNL_SQL_USER,
        password: process.env.SNL_SQL_PASSWORD,
        database: process.env.SNL_SQL_DB,
        host: process.env.SNL_SQL_HOST,
        dialect: process.env.SNL_SQL_DIALECT,
    },
    production: {
        username: process.env.SNL_SQL_USER,
        password: process.env.SNL_SQL_PASSWORD,
        database: process.env.SNL_SQL_DB,
        host: process.env.SNL_SQL_HOST,
        dialect: process.env.SNL_SQL_DIALECT,
    },
};