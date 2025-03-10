// ProcessController.js (controller)
'use strict';

const axios = require('axios');
const formated = require('../Services/FormatedService');

const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class ProcessController {
    async create(req, res) {
        if (req.user.role_id === 1) {
            try {
                const { inputs } = req.body
                const processformatedData = formated.Process(req.body);
                const processResponse = await axios.post(`http://${dbcomUrl}:${dbcomPort}/process/`, processformatedData);
                const ProcessId = processResponse.data.newProcess.id;

                if (inputs && Array.isArray(inputs)) {
                    for (const input of inputs) {
                        const inputFormatedData = formated.Input(input);
                        const inputResponse = await axios.post(`http://${dbcomUrl}:${dbcomPort}/input/`, inputFormatedData);
                        const inputId = inputResponse.data.newInput.id;
                        const { page } = input;

                        const processHasInputFormatedData = {
                            'ProcessId': ProcessId,
                            'InputId': inputId,
                            'page': page
                        };

                        await axios.post(`http://${dbcomUrl}:${dbcomPort}/processHasInput/`, processHasInputFormatedData);
                    }
                    const processHasInputresponse = await axios.get(`http://${dbcomUrl}:${dbcomPort}/processHasInput/${ProcessId}`);
                    res.status(processHasInputresponse.status).json(processHasInputresponse.data);
                } else {
                    res.status(processResponse.status).json(processResponse.data);
                }
            } catch (error) {
                if (error.response) {
                    res.status(error.response.status).json({ error: error.response.data });
                } else if (error.request) {
                    res.status(503).json({ error: 'Service unavailable' });
                } else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        } else {
            res.status(401).json({ error: 'Unauthorized access' });
        }
    }

    async get(req, res) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ error: 'Invalid process ID' });
        }

        if (req.user.role_id === 1) {
            try {

                const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/process/${id}`);

                if (!response.data) {
                    return res.status(404).json({ error: 'Process not found' });
                }
                
                res.status(200).json(response.data);
            } catch (error) {
                if (error.response) {
                    res.status(error.response.status).json({ error: error.response.data });
                } else if (error.request) {
                    res.status(503).json({ error: 'Service unavailable' });
                } else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        } else {
            res.status(401).json({ error: 'Unauthorized access' });
        }
    }

    async all(req, res) {
        // if (req.user.role_id === 1) {
            try {

                const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/process/`);

                if (!response.data) {
                    return res.status(404).json({ error: 'Process not found' });
                }
                
                res.status(200).json(response.data);
            } catch (error) {
                if (error.response) {
                    res.status(error.response.status).json({ error: error.response.data });
                } else if (error.request) {
                    res.status(503).json({ error: 'Service unavailable' });
                } else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        // } else {
        //     res.status(401).json({ error: 'Unauthorized access' });
        // }
    }

    async patch(req, res) {
        if (req.user.role_id === 1) {
            const id = Number(req.params.id);
            if (!id) {
                return res.status(400).json({ error: 'Invalid process ID' });
            }
            try {
                const formatedData = formated.Process(req.body);
                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/process/${id}`, formatedData);
                if (!response.data) {
                    return res.status(404).json({ error: 'Request has failed' });
                }
                res.status(200).json(response.data);
            } catch (error) {
                if (error.response) {
                    res.status(error.response.status).json({ error: error.response.data });
                } else if (error.request) {
                    res.status(503).json({ error: 'Service unavailable' });
                } else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        } else {
            res.status(401).json({ error: 'Unauthorized access' });
        }
    }

    async delete(req, res) {
        if (req.user.role_id === 1) {
            let id = Number(req.params.id);
            if (!id) {
                return res.status(400).json({ error: 'Invalid Data' });
            }
            try {
                await axios.delete(`http://${dbcomUrl}:${dbcomPort}/process/${id}`);
                res.status(200).json();
            } catch (error) {
                if (error.response) {
                    res.status(error.response.status).json({ error: error.response.data });
                } else if (error.request) {
                    res.status(503).json({ error: 'Service unavailable' });
                } else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        } else {
            res.status(401).json({ error: 'Unauthorized access' });
        }
    }
}

module.exports = new ProcessController();
