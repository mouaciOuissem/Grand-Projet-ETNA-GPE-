// Auth.js (Route)

const router = require('express').Router();
const ProcessController = require('../Controllers/ProcessController');
const InputController = require('../Controllers/InputController');
const ProcessHasInputController = require('../Controllers/ProcessHasInputController');
const Security = require('../Services/SecurityService');

/*************
 * Routes Input
 ************/

router.post('/input/', Security.userHeaderToReqUser, InputController.create);
router.get('/input/:id/', Security.userHeaderToReqUser, InputController.get);
router.get('/inputs/', Security.userHeaderToReqUser, InputController.all);
router.patch('/input/:id/', Security.userHeaderToReqUser, InputController.patch);
router.delete('/input/:id/', Security.userHeaderToReqUser, InputController.delete);

/*************
 * Routes Process
 ************/

router.post('/process/', Security.userHeaderToReqUser, ProcessController.create);
router.get('/process/:id/', Security.userHeaderToReqUser, ProcessController.get);
router.get('/process/', Security.userHeaderToReqUser, ProcessController.all);
router.patch('/process/:id/', Security.userHeaderToReqUser, ProcessController.patch);
router.delete('/process/:id/', Security.userHeaderToReqUser, ProcessController.delete);

/*************
 * Routes ProcessHasInput
 ************/
router.post('/processHasInput/', Security.userHeaderToReqUser, ProcessHasInputController.create);
router.get('/processHasInput/:ProcessId/', Security.userHeaderToReqUser, ProcessHasInputController.get);
router.post('/processHasInput/byUrl/', Security.userHeaderToReqUser, ProcessHasInputController.getByUrl);
router.patch('/change_input/:ProcessId/:InputId', Security.userHeaderToReqUser, ProcessHasInputController.patch);
router.delete('/delete_input/:ProcessId/:InputId', Security.userHeaderToReqUser, ProcessHasInputController.delete);

module.exports = router;