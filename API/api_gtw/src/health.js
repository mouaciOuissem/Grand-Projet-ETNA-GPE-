const health = require('@cloudnative/health-connect');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function healthCheck(app) {
    // LIVE //
    let healthCheck = new health.HealthChecker();

    const livePromise = () => new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: process.env.SNL_PORT,
            path: '/api/healthcheck',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            const { statusCode } = res;

            if (statusCode === 200) {
                resolve();
            } else {
                reject(new Error(`Health check failed with status code: ${statusCode}`));
            }
        });

        req.on('error', (err) => {
            reject(new Error(`Health check request failed: ${err.message}`));
        });

        req.end();
    });



    // READY //
    const checkUrl = (options) => new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            const { statusCode } = res;
    
            if (statusCode === 200) {
                resolve();
            } else {
                reject(new Error(`Check failed with status code: ${statusCode} for ${options.path}`));
            }
        });
    
        req.on('error', (err) => {
            reject(new Error(`Request failed: ${err.message} for ${options.path}`));
        });
    
        req.end();
    });

    const checkMultipleUrls = (optionsArray) => {
        // Exécuter chaque vérification en séquence
        return optionsArray.reduce((promise, options) => {
            return promise.then(() => checkUrl(options));
        }, Promise.resolve());
    };
    
    // Définir le tableau d'options
    const readinessOptions = [
        // { hostname: process.env.SNL_URL_AUTH, port: process.env.SNL_PORT_AUTH, path: '/api/health', method: 'GET' },
        // { hostname: process.env.SNL_URL_USR, port: process.env.SNL_PORT_USR, path: '/api/health', method: 'GET' },
        { hostname: process.env.SNL_URL_PROCESS, port: process.env.SNL_PORT_PROCESS, path: '/api/health', method: 'GET' },
        // { hostname: process.env.SNL_URL_PROCESS_STATUS, port: process.env.SNL_PORT_PROCESS_STATUS, path: '/api/health', method: 'GET' },
    ];
    
    // Créez une promesse de readiness check
    let liveCheck = new health.LivenessCheck("LivenessCheck", livePromise);
    healthCheck.registerLivenessCheck(liveCheck);

    const readinessCheck = () => checkMultipleUrls(readinessOptions);
    let readyCheck = new health.ReadinessCheck("ReadinessCheck", readinessCheck);
    healthCheck.registerReadinessCheck(readyCheck);
    

    app.use('/api/live', health.LivenessEndpoint(healthCheck));
    app.use('/api/ready', health.ReadinessEndpoint(healthCheck));
    app.use('/api/health', health.HealthEndpoint(healthCheck));
};
