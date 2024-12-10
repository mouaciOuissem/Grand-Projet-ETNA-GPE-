// UserController.js (controller)

const axios = require('axios');
const Auth = require('../Services/AuthService');

const usrUrl = process.env.SNL_URL_USR;
const usrPort = process.env.SNL_PORT_USR;
const authUrl = process.env.SNL_URL_AUTH;
const authPort = process.env.SNL_PORT_AUTH;

class UserController {
    async getSelf(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const User = JSON.parse(configs.headers.User)
            const UserId = User.id

            const response = await axios.get(`http://${usrUrl}:${usrPort}/user/` + UserId, configs);
            return res.status(response.status).send(response.data);

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
            return res.status(status).json({ error: message });
        }
                  
    }

    async get(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);

            const response = await axios.get(`http://${usrUrl}:${usrPort}/user/` + req.params.id, configs);
            return res.status(response.status).send(response.data);

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
            return res.status(status).json({ error: message });
        }
                  
    }

    async delete(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            
            const response = await axios.delete(`http://${usrUrl}:${usrPort}/user/` + req.params.id, configs);
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

    async updatePassword(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.patch(`http://${usrUrl}:${usrPort}/user/password/` + req.params.id, req.body, configs);
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

    async updateEmail(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            
            const response = await axios.patch(`http://${usrUrl}:${usrPort}/user/email/` + req.params.id, req.body, configs);
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

    async getDetailSelf(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const User = JSON.parse(configs.headers.User)
            const UserId = User.id

            const UserResponse = await axios.get(`http://${usrUrl}:${usrPort}/user/` + UserId, configs);
            const UserDetail = UserResponse.data.user.userDetails
            const UserdetailsId = UserDetail.id;
            if (!UserdetailsId){
                return res.status(500).json({ error: 'An error occurred while processing your request' });
            }
            const response = await axios.get(`http://${usrUrl}:${usrPort}/user/self/details/` + UserdetailsId, configs);
            return res.status(response.status).send(response.data);

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
            return res.status(status).json({ error: message });
        };
    }

    async getDetailById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.get(`http://${usrUrl}:${usrPort}/user/details/` + req.params.id, configs);
            return res.status(response.status).send(response.data);
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
            return res.status(status).json({ error: message });
        }
                  
    }

    async updateDetailSelf(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const User = JSON.parse(configs.headers.User)
            const UserId = User.id
            const UserResponse = await axios.get(`http://${usrUrl}:${usrPort}/user/` + UserId, configs);
           
            const UserDetail = UserResponse.data.user.userDetails
            const UserdetailsId = UserDetail.id;
            if (!UserdetailsId){
                return res.status(500).json({ error: 'An error occurred while processing your request' });
            }
            const response = await axios.patch(`http://${usrUrl}:${usrPort}/user/self/details/` + UserdetailsId, req.body, configs);
            return res.status(response.status).send(response.data);
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
            return res.status(status).json({ error: message });
        };
    }

    async updateDetailById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.patch(`http://${usrUrl}:${usrPort}/user/details/` + req.params.id, req.body, configs);
            return res.status(response.status).send(response.data);
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
            return res.status(status).json({ error: message });
        };
    }

    async all(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            
            const response = await axios.get(`http://${usrUrl}:${usrPort}/users/`, configs);
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

    async updateRole(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            
            const response = await axios.patch(`http://${usrUrl}:${usrPort}/user/role/` + req.params.id, req.body, configs);
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


module.exports = new UserController();