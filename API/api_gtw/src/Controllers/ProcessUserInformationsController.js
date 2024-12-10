// ProcessHasInputController.js (controller)

const axios = require('axios');
const Auth = require('../Services/AuthService');

const processUrl = process.env.SNL_URL_PROCESS;
const processPort = process.env.SNL_PORT_PROCESS;
const extensionDataUrl = process.env.SNL_URL_EXTENSION_DATA;
const extensionDataPort = process.env.SNL_PORT_EXTENSION_DATA;
const authUrl = process.env.SNL_URL_AUTH;
const authPort = process.env.SNL_PORT_AUTH;
const usrUrl = process.env.SNL_URL_USR;
const usrPort = process.env.SNL_PORT_USR;

class ProcessUserInformationsController {
    async formatedData(req, res) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is required and cannot be empty' });
        }
        const { url } = req.body
        if (!url) {
            return res.status(400).json({ error: 'Missing required parameter: url' });
        }
        try {
            const configs = await Auth.AuthCookieValidator(req.headers);
            const formated_process_data = {
                'url': url
            }

            const processResponse = await axios.post(`http://${processUrl}:${processPort}/processHasInput/byUrl/`, formated_process_data, configs)
            const process = processResponse.data.process
            const input = processResponse.data.input
            const User = JSON.parse(configs.headers.User)
            const UserId = User.id
            if (!UserId) {
                return res.status(400).json({ error: 'Invalid User Id' });
            }

            const UserResponse = await axios.get(`http://${usrUrl}:${usrPort}/user/` + UserId, configs);
            const UserDetail = UserResponse.data.user.userDetails
            const UserdetailsId = UserDetail.id;
            if (!UserdetailsId) {
                return res.status(500).json({ error: 'An error occurred while processing your request' });
            }
            const UserdetailsResponse = await axios.get(`http://${usrUrl}:${usrPort}/user/self/details/` + UserdetailsId, configs);
            const userDetails = UserdetailsResponse.data.userDetails
            const formated_data = {
                'userDetails': userDetails,
                'process': process,
                'input': input
            }
            const FormatedDataResponse = await axios.post(`http://${extensionDataUrl}:${extensionDataPort}/formated_data_extension/`, formated_data, configs)
            return res.status(FormatedDataResponse.status).send(FormatedDataResponse.data);

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

}


module.exports = new ProcessUserInformationsController();