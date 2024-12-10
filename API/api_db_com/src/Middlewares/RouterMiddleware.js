// RouterMiddleware.js (middleware)
'use strict';

const fs = require('fs');
const path = require('path');

const registerRoutes = (app, folderPath = '../Routes') => {
    const absoluteFolderPath = path.resolve(__dirname, folderPath);

    fs.readdirSync(absoluteFolderPath).forEach(file => {
        const filePath = path.join(absoluteFolderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            registerRoutes(app, path.join(folderPath, file));
        } else if (file.endsWith('.js')) {
            const route = require(filePath);
            app.use(route);
        }
    });
};

module.exports = registerRoutes;
