// InputController.js (controller)

const axios = require('axios');
const Auth = require('../Services/AuthService');

const processUrl = process.env.SNL_URL_PROCESS;
const processPort = process.env.SNL_PORT_PROCESS;


class InputController {
    async create(req, res) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is required and cannot be empty' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);

            const response = await axios.post(`http://${processUrl}:${processPort}/input/`, req.body, configs)
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

    async get(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);

            const response = await axios.get(`http://${processUrl}:${processPort}/input/` + req.params.id, configs)
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
        };
    }

    async all(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);

            const response = await axios.get(`http://${processUrl}:${processPort}/inputs/`, configs)
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
        };
    }

    async patch(req, res) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is required and cannot be empty' });
        } else if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        } else {
            try {
                const configs = await Auth.AuthCookieValidator(req.headers);

                const response = await axios.patch(`http://${processUrl}:${processPort}/input/` + req.params.id, req.body, configs)   
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

    async delete(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            
            const response = await axios.delete(`http://${processUrl}:${processPort}/input/` + req.params.id, configs);
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


module.exports = new InputController();