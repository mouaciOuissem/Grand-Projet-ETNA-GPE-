'use strict';

const mysql = require('mysql2');
const dotenv = require('dotenv');

// Configuration: Read environment variables from .env file
dotenv.config();

const host = {
    connectionLimit: 100,
    host: process.env.SNL_SQL_HOST,
    user: process.env.SNL_SQL_USER,
    password: process.env.SNL_SQL_PASSWORD,
    database: process.env.SNL_SQL_DB
};

exports.MySQL_Connect = function() {
    return mysql.createPool(host);
}
