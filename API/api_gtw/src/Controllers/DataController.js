// DataController.js (controller)

const axios = require('axios');
const Auth = require('../Services/AuthService');

const DataUrl = process.env.SNL_URL_DATA;
const DataPort = process.env.SNL_PORT_DATA;

class DataController {
    async listAllBucket(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.get(`http://${DataUrl}:${DataPort}/list-buckets`, configs)
            res.status(response.status).send(response.data);

        } catch (error) {
            let status = 500; 
            let message = 'An unexpected error occurred';

            if (error.response) {
                status = error.response.status || 500;
                message = error.response.data || 'An error occurred while processing your request';
            } else if (error.request) {
                message = 'No response received from the authentication service';
            } else {
                message = `Error in request setup: ${error.message}`;
            }
            res.status(status).json({ error: message });
        }
    }

    async getBucketDetails(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const bucketName = req.params.bucketName;
            console.log(bucketName)
            const response = await axios.get(`http://${DataUrl}:${DataPort}/detail-bucket/`+ bucketName, configs)
            res.status(response.status).send(response.data);

        } catch (error) {
            let status = 500; 
            let message = 'An unexpected error occurred';

            if (error.response) {
                status = error.response.status || 500;
                message = error.response.data || 'An error occurred while processing your request';
            } else if (error.request) {
                message = 'No response received from the authentication service';
            } else {
                message = `Error in request setup: ${error.message}`;
            }
            res.status(status).json({ error: message });
        }
    }

    async listObjects(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.get(`http://${DataUrl}:${DataPort}/list-objects/`+ req.params.bucketName, configs)
            res.status(response.status).send(response.data);

        } catch (error) {
            let status = 500; 
            let message = 'An unexpected error occurred';

            if (error.response) {
                status = error.response.status || 500;
                message = error.response.data || 'An error occurred while processing your request';
            } else if (error.request) {
                message = 'No response received from the authentication service';
            } else {
                message = `Error in request setup: ${error.message}`;
            }
            res.status(status).json({ error: message });
        }
    }

    async viewFile(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.get(`http://${DataUrl}:${DataPort}/view-file/${req.params.bucketName}/${req.params.fileName}`, configs);
            
            res.status(response.status).send(response.data);

        } catch (error) {
            let status = 500; 
            let message = 'An unexpected error occurred';

            if (error.response) {
                status = error.response.status || 500;
                message = error.response.data || 'An error occurred while processing your request';
            } else if (error.request) {
                message = 'No response received from the authentication service';
            } else {
                message = `Error in request setup: ${error.message}`;
            }
            res.status(status).json({ error: message });
        }
    }
}

module.exports = new DataController();