// MySQL.js (Route)

const router = require('express').Router();
const StatusController = require('../Controllers/StatusController');

/*************
 * Routes Status
 ************/

router.post('/status/', StatusController.create);
router.get('/status/:id/', StatusController.get);
router.get('/status/', StatusController.all);
router.patch('/status/:id/', StatusController.patch);
router.delete('/status/:id/', StatusController.delete);

module.exports = router;