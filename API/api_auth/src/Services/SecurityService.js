'use strict';
const jwt = require('jsonwebtoken');

class SecurityService {
// SecurityService.js (Tools)
    EmailValidator(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    generateToken(id, username, email, role_id, password) {
        const payload = {
            id: id,
            username: username,
            email: email,
            role_id: role_id,
            password: password,
            created_at: new Date().getTime()
        };

        // Signer le token avec la clé secrète de l'environnement
        return jwt.sign(payload, process.env.SNL_SECRET, { expiresIn: '2h' });
    }

    setCookie(res, token) {
        res.cookie('authToken', token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7200000 // 2 hour
        });
    }

    generateTokenAndSetCookie(res, id, username, email, role_id) {
        const token = this.generateToken(id, username, email, role_id);
        this.setCookie(res, token);
        return token;
    }
}

module.exports = new SecurityService();
