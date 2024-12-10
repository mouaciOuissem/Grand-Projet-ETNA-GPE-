// UserHasProcessController.js (controller)

'use strict';

const axios = require('axios');
const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class UserHasProcessController {
    async create(req, res) {
        const UserId = Number(req.params.UserId);
        if (!UserId) {
            return res.status(400).json({ error: 'Invalid User Id' });
        }
        if (req.user.role_id === 1 || req.user.id === UserId) {
            try {
                const UserId = Number(req.params.UserId);
                const { ProcessId, StatusId} = req.body

                if (!ProcessId || !StatusId) {
                    return res.status(400).json({ error: "ERR_DATAS", message: "Invalid data" });
                }

                const response = await axios.post(`http://${dbcomUrl}:${dbcomPort}/assign_process_to_user/${UserId}`, req.body);

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
            return res.status(400).json({ error: 'Invalid UserHasProcess ID' });
        }

        try {

            const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/one_process_by_user/${id}`);

            if (!response.data) {
                return res.status(404).json({ error: 'UserHasProcess not found' });
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

    async all(req, res) {
        const UserId = Number(req.params.UserId);

        if (!UserId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        if (req.user.role_id === 1 || req.user.id === UserId) {
                try {

                    const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/all_process_by_user/${UserId}`);

                    if (!response.data) {
                        return res.status(404).json({ error: 'UserHasProcess not found for this user' });
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
        const id = Number(req.params.id);
        const { StatusId } = req.body;
        if (!id || !StatusId) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        try {
            const formatedData = {
                'StatusId': StatusId
            }
            const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/update_process_status_by_user/${id}`, formatedData);
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

    async delete(req, res) {
        let id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        try {
            await axios.delete(`http://${dbcomUrl}:${dbcomPort}/delete_process_do_by_user/${id}`);
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
    }
}

module.exports = new UserHasProcessController();
