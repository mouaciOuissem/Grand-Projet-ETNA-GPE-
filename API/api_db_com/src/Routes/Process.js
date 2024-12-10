// MySQL.js (Route)

const router = require('express').Router();
const ProcessController = require('../Controllers/ProcessController');
const UserHasProcessController = require('../Controllers/UserHasProcessController');

/*************
 * Routes Process
 ************/

router.post('/process/', ProcessController.create);
router.get('/process/:id/', ProcessController.get);
router.get('/process/', ProcessController.all);
router.patch('/process/:id/', ProcessController.patch);
router.delete('/process/:id/', ProcessController.delete);

/*************
 * Routes UserHasProcessController
 ************/

router.post('/assign_process_to_user/:UserId', UserHasProcessController.create);
router.get('/one_process_by_user/:id/', UserHasProcessController.get);
router.get('/all_process_by_user/:UserId', UserHasProcessController.all);
router.patch('/update_process_status_by_user/:id/', UserHasProcessController.patch);
router.delete('/delete_process_do_by_user/:id/', UserHasProcessController.delete);

module.exports = router;