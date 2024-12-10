// index.js (Entry Point)

'use strict';

const express = require('express');
const next = require('next');
const dotenv = require('dotenv');

dotenv.config();

const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './src',
});
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    // Point de terminaison de santé
    app.get('/api/health', (req, res) => {
        res.status(200).send('OK');
    });

    // Gérer toutes les autres requêtes avec Next.js
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    // Démarrer le serveur Express
    app.listen(process.env.SNL_PORT, () => {
        console.log(`--- SERVICE FRONT UP! Listen on port `+process.env.SNL_PORT+ ` --- `);
    });
});
