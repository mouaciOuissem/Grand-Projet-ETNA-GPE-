// Security.js (Tools)

'use strict';

const crypto = require('crypto');


class Security {
    generateHash(methode, input) {
        const cryptHash = crypto.createHash(methode);
        cryptHash.update(input);
        const hash = cryptHash.digest('hex');
        return hash;
    }

    userHeaderToReqUser(req, res, next) {
        req.user = JSON.parse(req.header('User'));
        next();
    }
}


module.exports = new Security();