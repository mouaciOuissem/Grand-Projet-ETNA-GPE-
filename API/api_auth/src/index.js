// index.js (Entry Point)

'use strict';

const express = require("express");
const routerMiddleware = require('./Middlewares/RouterMiddleware');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = express();


// Configuration: Read environment variables from .env file
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Point de terminaison de santé
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

// Add routes using router middleware
routerMiddleware(app);

(async() => {

    /********************
     * Start API listener
     *******************/
    app.listen(process.env.SNL_PORT, () => {
        console.log("--- SERVICE AUTH UP! Listen on port: "+process.env.SNL_PORT+" ---");
    });
})();
