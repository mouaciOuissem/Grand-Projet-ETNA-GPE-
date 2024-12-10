// UserDetailsController.js (controller)
'use strict';

const axios = require('axios');

const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class ProcessHasInputController {
    async create(req, res) {
        if (req.user.role_id === 1) {
            try {
                const { ProcessId, inputs} = req.body

                if (!ProcessId || !inputs) {
                    return res.status(400).json({ error: "ERR_DATAS", message: "Invalid data" });
                }

                if (inputs && Array.isArray(inputs)) {
                    for (const input of inputs) {
                        const { id, page, rank } = input;
                        if (!id || !page || !rank) {
                            return res.status(400).json({ error: "ERR_DATAS", message: "Invalid data" });
                        }

                        const processHasInputFormatedData = {
                            'ProcessId': ProcessId,
                            'InputId': id,
                            'page': page,
                            'rank': rank
                        };

                        await axios.post(`http://${dbcomUrl}:${dbcomPort}/processHasInput/`, processHasInputFormatedData);
                    }
                    const processHasInputresponse = await axios.get(`http://${dbcomUrl}:${dbcomPort}/processHasInput/${ProcessId}`);
                    res.status(processHasInputresponse.status).json(processHasInputresponse.data);
                } else {
                    return res.status(400).json({ error: "ERR_DATAS", message: "Invalid data" });
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
        const ProcessId = Number(req.params.ProcessId);

        if (!ProcessId) {
            return res.status(400).json({ error: 'Invalid process ID' });
        }

        if (req.user.role_id === 1) {
                try {

                    const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/processHasInput/${ProcessId}`);

                    if (!response.data) {
                        return res.status(404).json({ error: 'ProcessHasInput not found' });
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

    async getByUrl(req, res) {
        const  { url } = req.body

        if (!url) {
            return res.status(400).json({ error: 'Invalid process url' });
        }

        try {
            const formated_data = {
                'url': url
            }

            const response = await axios.post(`http://${dbcomUrl}:${dbcomPort}/processHasInput/byUrl`, formated_data);

            if (!response.data) {
                return res.status(404).json({ error: 'ProcessHasInput not found' });
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

    async patch(req, res) {
        if (req.user.role_id === 1) {
            const ProcessId = Number(req.params.ProcessId);
            const InputId = Number(req.params.InputId);
            const newInputId = req.body.newInputId
            if (!ProcessId || !InputId || !newInputId) {
                return res.status(400).json({ error: 'Invalid process ID' });
            }
            try {
                const formatedData = {
                    "newInputId": newInputId
                }
                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/change_input/${ProcessId}/${InputId}`, formatedData);
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
            const ProcessId = Number(req.params.ProcessId);
            const InputId = Number(req.params.InputId);
            if (!ProcessId || !InputId) {
                return res.status(400).json({ error: 'Invalid process or input ID' });
            }
            try {
                const response = await axios.delete(`http://${dbcomUrl}:${dbcomPort}/delete_input/${ProcessId}/${InputId}`);
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
}

module.exports = new ProcessHasInputController();
