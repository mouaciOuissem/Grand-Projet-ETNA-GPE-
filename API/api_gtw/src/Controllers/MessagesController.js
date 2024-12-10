// MessagesController.js (controller)

const axios = require('axios');
const Auth = require('../Services/AuthService');

const MessageUrl = process.env.SNL_URL_MESSAGE;
const MessagePort = process.env.SNL_PORT_MESSAGE;

class MessagesController {
    async listAllMessages(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.get(`http://${MessageUrl}:${MessagePort}/messages`, configs)
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

    async createMessage(req, res) {
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const response = await axios.post(`http://${MessageUrl}:${MessagePort}/messages/`+ req.body, configs)
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

module.exports = new MessagesController();