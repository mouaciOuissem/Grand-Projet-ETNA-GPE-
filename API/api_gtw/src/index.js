// index.js (Entry Point)

'use strict';
const cors = require('cors');
const express = require("express");
const routerMiddleware = require('./Middlewares/RouterMiddleware');
const dotenv = require('dotenv');
const swaggerSetup = require('./swagger');
const cookieParser = require('cookie-parser');

const app = express();

// Configuration: Read environment variables from .env file
dotenv.config();

swaggerSetup(app);

app.use(cors({
    origin: [process.env.SNL_URL_FRONT, process.env.SNL_URL_FRONT_ADMIN, "http://localhost:8081"],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
}));
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie'
    )
    // res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next()
  })

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Point de terminaison de santé
app.get('/api/health', (req, res) => {
    res.status(200).json('OK')
});

// Add routes using router middleware
routerMiddleware(app);

(async() => {
    /********************
     * Start API listener
     *******************/
    app.listen(process.env.SNL_PORT, () => {
        console.log("--- SERVICE GATEWAY UP! Listen on port: "+process.env.SNL_PORT+" ---");
    });
})();
