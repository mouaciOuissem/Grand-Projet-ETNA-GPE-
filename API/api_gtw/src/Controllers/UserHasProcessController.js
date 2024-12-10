// UserController.js (controller)

const axios = require('axios');
const Auth = require('../Services/AuthService');

const processStatusUrl = process.env.SNL_URL_PROCESS_STATUS;
const processStatusPort = process.env.SNL_PORT_PROCESS_STATUS;


class UserHasProcessController {
    async create(req, res) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is required and cannot be empty' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const User = JSON.parse(configs.headers.User)
            const UserId = User.id
            const response = await axios.post(`http://${processStatusUrl}:${processStatusPort}/assign_process_to_user/` + UserId, req.body, configs)
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

            const response = await axios.get(`http://${processStatusUrl}:${processStatusPort}/one_process_by_user/` + req.params.id, configs)
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
        if (!req.params.UserId) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);

            const response = await axios.get(`http://${processStatusUrl}:${processStatusPort}/all_process_by_user/` + req.params.UserId, configs)
            res.status(response.status).send(response.data);

        } catch (error) {
            let status = 500; 
            let message = 'An unexpected error occurred';

            if (error.response) {
                console.log(error)
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

                const response = await axios.patch(`http://${processStatusUrl}:${processStatusPort}/update_process_status_by_user/` + req.params.id, req.body, configs)   
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
            
            const response = await axios.delete(`http://${processStatusUrl}:${processStatusPort}/delete_process_do_by_user/` + req.params.id, configs);
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


module.exports = new UserHasProcessController();