// AuthenticateMiddleware.js (middleware)

'use strict';

const jwt = require('jsonwebtoken');
const axios = require('axios');

const dbcomUrl = process.env.SNL_URL_DBCOM;
const dbcomPort = process.env.SNL_PORT_DBCOM;


const verify = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        token = String(token).split(' ')[1];

        if (!token) {
            req.user = {
                id: 0,
                username: "anonymous",
                token: null,
                role_id: 6
            };
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.SNL_SECRET);
        const { id, email, role_id } = decodedToken;
        console.log(decodedToken);
        if (decodedToken.exp * 1000 < Date.now()) {
            return res.status(401).send("ERR_TOKEN_EXP");
        }

        try {
            const response = await axios.get(`http://${dbcomUrl}:${dbcomPort}/user/${id}`);
            const user = response.data.user;

            if (!user) {
                return res.status(401).send("ERR_TOKEN_INV");
            }
            if (user.email !== email || user.id !== id || user.role_id !== role_id) {
                return res.status(401).send("ERR_TOKEN_INV");
            }

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).send(err.response.data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = verify;