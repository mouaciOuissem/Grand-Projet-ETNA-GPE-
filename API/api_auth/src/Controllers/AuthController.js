// AuthController.js (controller)
'use strict';

const axios = require('axios');
const bcrypt = require('bcryptjs');
const Security = require('../Services/SecurityService');
const jwt = require('jsonwebtoken');

const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;

class AuthController {
    async register(req, res) {
        try {
            const checkData = req.body;
            const checkmail = Security.EmailValidator(checkData.email);

            if (!checkmail || !checkData.password) {
                return res.status(400).json({ error: "ERR_DATAS", message: "Invalid email or password" });
            }

            const formatedData = {
                "username": checkData.username,
                "email": checkData.email,
                "password": await bcrypt.hash(checkData.password, 10)
            }
            const response = await axios.post(`http://${dbcomUrl}:${dbcomPort}/register/`, formatedData);
            const newUser = response.data.newUser

            const token = Security.generateTokenAndSetCookie(res, newUser.id, newUser.username, newUser.email, newUser.role_id, newUser.password);
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            if (error.response) {
                res.status(error.response.status).json({ error: error.response.data });
            } else if (error.request) {
                res.status(503).json({ error: 'Service unavailable' });
            } else {
                res.status(500).json({ error: 'Internal server errssor' });
            }
        }
    }

    async authenticate(req, res) {
        const { identifier, password } = req.body;
        const checkmail = Security.EmailValidator(identifier);

        // if (!checkmail || !password) {
        //     return res.status(400).json({ error: "ERR_DATAS", message: "Invalid email or password" });
        // }

        // const formatedData = {
        //     "email": email
        // };
        const query = checkmail ? { email: identifier } : { username: identifier };
        try {
            const response = await axios.post(`http://${dbcomUrl}:${dbcomPort}/login/`, query);
            if (response.status === 404 || response.status === 500) {
                res.status(response.status).json(response.data);
                return;
            }

            const user = response.data.user;

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // const token = Security.generateTokenAndSetCookie(res, user.id, user.email, user.role_id, user.password);
            const token = Security.generateTokenAndSetCookie(res, user.id, user.username, user.email, user.role_id, user.password);
            res.status(200).json({ message: 'Login successful', token });

        } catch (error) {
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else if (error.request) {
                res.status(500).json({ error: 'No response received from the server' });
            } else {
                console.error('Error message:', error.message);
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    async checkCookie (req, res)  {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ isAuthenticated: false });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.SNL_SECRET);

            return res.status(200).json({ 
                isAuthenticated: true,
                user: {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email,
                    role_id: decoded.role_id
                }
            });
        } catch (error) {
            return res.status(401).json({ isAuthenticated: false });
        }
    }

    async logout(req, res) {
        try {
            console.log("Attempting to clear cookie");
    
            if (req.cookies && req.cookies.authToken) {
    
                res.setHeader('Set-Cookie', 'authToken=; Max-Age=0; path=/;');
                
                console.log("Logged out successfully");
                res.status(200).json({ message: 'Logged out successfully' });
            } else {
                console.log("No authToken cookie found");
                res.status(400).json({ error: 'No authToken cookie found' });
            }
        } catch (error) {
            console.error('Error during logout:', error);
            res.status(500).json({ error: 'Internal server error Auth' });
        }
    }

    verifReturn(req, res) {
        res.status(200).send(req.user); 
    }
}


module.exports = new AuthController();