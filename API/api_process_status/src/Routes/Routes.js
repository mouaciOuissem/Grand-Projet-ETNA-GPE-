// Auth.js (Route)

const router = require('express').Router();
const StatusController = require('../Controllers/StatusController');
const UserHasProcessController = require('../Controllers/UserHasProcessController');
const Security = require('../Services/SecurityService');


/*************
 * Routes Status
 ************/

router.post('/status/', Security.userHeaderToReqUser, StatusController.create);
router.get('/status/:id/', Security.userHeaderToReqUser, StatusController.get);
router.get('/status/', Security.userHeaderToReqUser, StatusController.all);
router.patch('/status/:id/', Security.userHeaderToReqUser, StatusController.patch);
router.delete('/status/:id/', Security.userHeaderToReqUser, StatusController.delete);

/*************
 * Routes UserHasProcessController
 ************/

router.post('/assign_process_to_user/:UserId/', Security.userHeaderToReqUser, UserHasProcessController.create);
router.get('/one_process_by_user/:id/', Security.userHeaderToReqUser, UserHasProcessController.get);
router.get('/all_process_by_user/:UserId', Security.userHeaderToReqUser, UserHasProcessController.all);
router.patch('/update_process_status_by_user/:id/', Security.userHeaderToReqUser, UserHasProcessController.patch);
router.delete('/delete_process_do_by_user/:id/', Security.userHeaderToReqUser, UserHasProcessController.delete);

module.exports = router;