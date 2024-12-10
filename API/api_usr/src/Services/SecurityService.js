// Security.js (Tools)

'use strict';
const jwt = require('jsonwebtoken');
class Security {
    userHeaderToReqUser(req, res, next) {
        req.user = JSON.parse(req.header('User'));
        next();
    }

    EmailValidator(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    generateToken(id, email, role_id) {
        // Utilisez uniquement les informations nécessaires pour le token
        const payload = {
            id: id,
            email: email,
            role_id: role_id,
            created_at: new Date().getTime()
        };

        // Signer le token avec la clé secrète de l'environnement
        return jwt.sign(payload, process.env.SNL_SECRET, { expiresIn: '5h' });
    }
}


module.exports = new Security();