// Auth.js (Route)

const router = require('express').Router();
const FormatedController = require('../Controllers/FormatedController');
const Security = require('../Services/SecurityService');

/*************
 * Routes Input
 ************/

router.post('/formated_data_extension/', Security.userHeaderToReqUser, FormatedController.formated);
router.post('/formated_url_process/', Security.userHeaderToReqUser, FormatedController.formatedUrl);

module.exports = router;