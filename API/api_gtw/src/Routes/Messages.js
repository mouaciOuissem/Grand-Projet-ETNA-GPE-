// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Message = require('../Controllers/MessagesController');

router.post('/api/messages/', Message.createMessage);
router.get('/api/messages/', Message.listAllMessages);
// router.get('/api/messages/:id', Message.getMessageById);



module.exports = router;