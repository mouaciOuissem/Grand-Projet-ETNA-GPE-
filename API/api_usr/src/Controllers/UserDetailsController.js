// UserDetails.js (controller)
'use strict';

const axios = require('axios');
const formated = require('../Services/FormatedService');
const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class UserDetailsController {
    // Méthode pour récupérer une certification
    async findOne(req, res) {
        const id = Number(req.params.UserdetailsId);
        if (!id) {
            return res.status(400).json({ error: 'Invalid userDetail ID' });
        }
        if (req.user.role_id === 1) {
            try {
                const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/user/details/${id}`);
                if (!response.data) {
                    return res.status(404).json({ error: 'User not found' });
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

    async findSelf(req, res) {
        const id = Number(req.params.UserdetailsId);
        if (!id) {
            return res.status(400).json({ error: 'Invalid userDetail ID' });
        }
        try {
            const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/user/details/${id}`);
            if (!response.data) {
                return res.status(404).json({ error: 'User not found' });
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
    }

    // Méthode pour mettre à jour une certification
    async update(req, res) {
        const id = Number(req.params.UserdetailsId);
        if (!id) {
            return res.status(400).json({ error: 'Invalid User details ID' });
        }
        if (req.user.id === id || req.user.role_id === 1) {
            try {
                const formatedData = formated.UserDetails(req.body);
                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/user/details/${id}`, formatedData);
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

    async Selfupdate(req, res) {
        const id = Number(req.params.UserdetailsId);
        if (!id) {
            return res.status(400).json({ error: 'Invalid User details ID' });
        }
        try {
            const formatedData = formated.UserDetails(req.body);
            const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/user/details/${id}`, formatedData);
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
    }
}

module.exports = new UserDetailsController();
