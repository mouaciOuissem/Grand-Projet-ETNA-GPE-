// Auth.js (Route)

const router = require('express').Router();
const Auth = require('../Controllers/AuthController');

const Authenticate = require('../Middlewares/AuthenticateMiddleware');

/*************
 * Routes Auth
 ************/

router.post('/register/', Auth.register);
router.post('/authenticate/', Auth.authenticate);
router.get('/check/', Auth.verifReturn);
router.get('/auth/check-cookie/', Auth.checkCookie);
router.post('/auth/logout/',  Auth.logout);

module.exports = router;