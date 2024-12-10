// MySQL.js (Route)

const router = require('express').Router();
const AuthController = require('../Controllers/AuthController');

/*************
 * Routes Auth
 ************/

// User base
router.post('/login/', AuthController.login);
router.post('/register/', AuthController.register);

module.exports = router;