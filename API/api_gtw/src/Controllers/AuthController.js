// AuthController.js (controller)

const axios = require('axios');
const authUrl = process.env.SNL_URL_AUTH;
const authPort = process.env.SNL_PORT_AUTH;
class AuthController {
    async register(req, res) {
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'ERR_MISSING_DATA' });
        }

        try {
            const response = await axios.post(`http://${authUrl}:${authPort}/register/`, req.body)
            Object.keys(response.headers).forEach(key => {
                res.setHeader(key, response.headers[key]);
            });
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

    async login(req, res) {
        if (!req.body.identifier || !req.body.password) {
            return res.status(400).json({ error: 'ERR_MISSING_DATA' });
        }

        try {
            const response = await axios.post(`http://${authUrl}:${authPort}/authenticate/`, req.body)
            Object.keys(response.headers).forEach(key => {
                res.setHeader(key, response.headers[key]);
            });
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
        };
    }

    async checkCookie(req, res){
        try {
            const response = await axios.get(`http://${authUrl}:${authPort}/auth/check-cookie/`, {
                headers: {
                    ...req.headers,
                    Cookie: req.headers.cookie
                },
                withCredentials: true
            })

            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            res.status(response.status).send(response.data);

        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                return res.status(error.response.status).json(error.response.data);
            }
    
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    async logout(req, res) {
        try {
            const response = await axios.post( `http://${authUrl}:${authPort}/auth/logout/`, {}, {
                    headers: {
                        // ...req.headers,
                        Cookie: req.headers.cookie,
                    },
                    withCredentials: true,
                }
            );
            Object.keys(response.headers).forEach(key => {
                res.setHeader(key, response.headers[key]);
            });
    
            console.log('Réponse du service distant:', response.status, response.data);
    
            res.status(response.status).send(response.data);
        } catch (error) {

            if (error.response) {
                console.error('Erreur du service distant:', error.response.status, error.response.data);
    
                res.status(error.response.status).json(error.response.data);
    
            } else {
                console.error('Erreur sans réponse du service distant:', error.message);
    
                res.status(500).json({ error: 'An error occurred' });
            }
        }
    }
}


module.exports = new AuthController();