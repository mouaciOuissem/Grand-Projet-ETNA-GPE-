// InputController.js (controller)
'use strict';

const axios = require('axios');
const formated = require('../Services/FormatedService');

class FormatedController {
    async formated(req, res) {
        try {
            const { input, userDetails, process} = formated.ValidFields(req.body);
            const mappedInputs = formated.FormatedData(input, userDetails, process);

            return res.status(200).json({
                process: process,
                input: mappedInputs,
                message: 'Data successfully mapped to user information.'
            });
            
        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ error: error.response.data });
            } else if (error.request) {
                return res.status(503).json({ error: 'Service unavailable' });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async formatedUrl(req, res) {
        try {
            const { process } = formated.ValidFields(req.body);

            if (!process) {
                return res.status(400).json({ error: "Invalid process" });
            }

            const urls = process
            .filter(process => process.url !== null)
            .map(process => process.url);

            return res.status(200).json({
                urls: urls,
                message: 'Data successfully mapped to process information.'
            });
            
        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ error: error.response.data });
            } else if (error.request) {
                return res.status(503).json({ error: 'Service unavailable' });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

module.exports = new FormatedController();
