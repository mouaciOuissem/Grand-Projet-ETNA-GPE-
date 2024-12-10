// UserController.js (controller)
'use strict';

const axios = require('axios');
const Security = require('../Services/SecurityService');
const bcrypt = require('bcryptjs');
const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class UserController {
    async findOne(req, res) {
        if (!req.user && req.headers['user']) {
            try {
                req.user = JSON.parse(req.headers['user']);
            } catch (error) {
                return res.status(400).json({ error: 'Invalid user data format' });
            }
        }
        // console.log(req.user);
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        if (req.user.id === id || req.user.role_id === 1) {
                try {

                    const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/user/${id}`);

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

    async updateEmail(req, res) {
        const id = Number(req.params.id);
        const newEmail = req.body.email;
        const checkmail = Security.EmailValidator(newEmail);

        if (!id || !checkmail) {
            return res.status(400).json({ error: 'Invalid Data' });
        }
    
        if (req.user.id === id || req.user.role_id === 1) {
            try {
                const formatedData = {
                    "email": newEmail
                }

                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/user/email/${id}`, formatedData);
                
                if (!response.data) {
                    return res.status(404).json({ error: 'Request has failed' });
                }
                const user = response.data.user
  
                const token = Security.generateToken(user.id, user.email, user.role_id);

                res.status(200).json({ message : response.data, token});
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

    // Méthode pour mettre à jour le mot de passe d'un utilisateur
    async updatePassword(req, res) {
        const id = Number(req.params.id);
        const newPassword = req.body.password;

        if (!id || !newPassword) {
            return res.status(400).json({ error: 'Invalid Data' });
        }

        if (req.user.id === id || req.user.role_id === 1) {
            try {

                const formatedData = {
                    "password": await bcrypt.hash(newPassword, 10)
                }

                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/user/password/${id}`, formatedData);
                
                if (!response.data) {
                    return res.status(404).json({ error: 'Request has failed' });
                }
                const user = response.data.user

                const token = Security.generateToken(user.id, user.email, user.role_id);
                res.status(200).json({ message : response.data, token});
            } catch (error) {
                if (error.response) {
                    res.status(error.response.status).json({ error: error.response.data });
                } else if (error.request) {
                    res.status(503).json({ error: 'Service unavailable' });
                } else {
                    console.log(error)
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        } else {
            res.status(401).json({ error: 'Unauthorized access' });
        }
    }

    // Méthode pour supprimer un utilisateur
    async delete(req, res) {
        let id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Invalid Data' });
        }
        if (id === id || req.user.role_id === 1) {
                try {
                    await axios.delete(`http://${dbcomUrl}:${dbcomPort}/user/${id}`);
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

    async updateRole(req, res) {
        const id = Number(req.params.id);
        const newRole = Number(req.body.role_id);

        if (!id || !newRole) {
            return res.status(400).json({ error: 'Invalid Data' });
        }
    
        if (req.user.id === id || req.user.role_id === 1) {
            try {
                const formatedData = {
                    "role_id": newRole
                }
                const response = await axios.patch(`http://${dbcomUrl}:${dbcomPort}/user/role/${id}`, formatedData);
                
                if (!response.data) {
                    return res.status(404).json({ error: 'Request has failed' });
                }

                const user = response.data.user
  
                const token = Security.generateToken(user.id, user.email, user.role_id);
                res.status(200).json({ message : response.data, token});
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

    // Méthode pour récupérer tous les utilisateurs
    async all(req, res) {
        if (!req.user && req.headers['user']) {
            try {
                req.user = JSON.parse(req.headers['user']);
            } catch (error) {
                return res.status(400).json({ error: 'Invalid user data format' });
            }
        }
        if (req.user.role_id === 1) {
            try {
                const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/users/`);

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

module.exports = new UserController();
