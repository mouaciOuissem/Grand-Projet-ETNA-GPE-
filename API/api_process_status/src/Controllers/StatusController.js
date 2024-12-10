// StatusController.js (controller)
'use strict';

const axios = require('axios');
const formated = require('../Services/FormatedService');

const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class StatusController {
    async create(req, res) {
        if (req.user.role_id === 1) {
            try {
                const { name } = req.body

                if (!name) {
                    return res.status(400).json({ error: "ERR_DATAS", message: "Invalid data" });
                }

                const response = await axios.post(`http://${dbcomUrl}:${dbcomPort}/status/`, req.body);

                res.status(response.status).json(response.data);
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
            return res.status(400).json({ error: 'Invalid status ID' });
        }

        if (req.user.role_id === 1) {
                try {

                    const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/status/${id}`);

                    if (!response.data) {
                        return res.status(404).json({ error: 'Status not found' });
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
        if (req.user.role_id === 1) {
            try {

                const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/status/`);

                if (!response.data) {
                    return res.status(404).json({ error: 'Status not found' });
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

    async patch(req, res) {
        if (req.user.role_id === 1) {
            const id = Number(req.params.id);
            const formatedData = formated.Status(req.body);
            try {
                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/status/${id}`, formatedData);
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
                await axios.delete(`http://${dbcomUrl}:${dbcomPort}/status/${id}`);
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

module.exports = new StatusController();
