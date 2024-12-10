// index.js (Entry Point)
'use strict';

const express = require('express');
const routerMiddleware = require('./Middlewares/RouterMiddleware');
const dotenv = require('dotenv');
const app = express();

// Configuration: Read environment variables from .env file
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Point de terminaison de santé
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

routerMiddleware(app);

/*********************
 * Start API listener
 ********************/
app.listen(process.env.SNL_PORT, () => {
    console.log("---- SERVICE DB COM READY Listen on port: "+process.env.SNL_PORT+" ---");
});