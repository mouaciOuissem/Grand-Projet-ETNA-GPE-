// SecurityService.js (Tools)

'use strict';
const axios = require('axios');
const authUrl = process.env.SNL_URL_AUTH;
const authPort = process.env.SNL_PORT_AUTH;

class AuthService {

    async AuthCookieValidator(headers) {
        const maxAttempts = 3;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const clonedHeaders = { ...headers };
                delete clonedHeaders['content-type'];

                const cookieResponse = await axios.get(`http://${authUrl}:${authPort}/auth/check-cookie/`, {
                    headers: {
                        ...clonedHeaders,
                        Cookie: clonedHeaders.cookie
                    },
                    withCredentials: true
                });

                const user = cookieResponse.data?.user;
                const configs = {
                    headers: {
                        'User': JSON.stringify(user)
                    }
                };
                return configs;

            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error.message);
                if (attempt === maxAttempts - 1) {
                    throw new Error('Failed to validate cookie after multiple attempts');
                }
            }
        }
    }
    
    
    async AuthValidator(token) {
        let configs = {
            headers: {
                'Authorization': token
            }
        };
    
        try {
            console.log(config);
            const authResponse = await axios.get(`http://${authUrl}:${authPort}/auth/check/`, configs);
    
            // Vérifier que la réponse contient les données attendues
            if (!authResponse.data || typeof authResponse.data !== 'object') {
                throw new Error('Invalid response format from authentication service');
            }
    
            // Ajouter les informations utilisateur dans les headers
            configs.headers['User'] = JSON.stringify(authResponse.data);
            return configs;
    
        } catch (error) {
            if (error.response) {
                console.error('Error in AuthValidator - Response error:', error.response.data);
                throw new Error(`Authentication service responded with status ${error.response.status}: ${error.response.data.error || 'Unknown error'}`);
            } else if (error.request) {
                console.error('Error in AuthValidator - No response received:', error.request);
                throw new Error('No response received from authentication service');
            } else {
                console.error('Error in AuthValidator - Request setup error:', error.message);
                throw new Error('Error in setting up the authentication request');
            }
        }
    }
}


module.exports = new AuthService();