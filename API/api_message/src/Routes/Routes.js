// Message.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Message = require('../Controllers/MessageController');

router.get('/messages/', Message.listAllMessages);

router.post('/messages/', Message.createMessage);

module.exports = router;