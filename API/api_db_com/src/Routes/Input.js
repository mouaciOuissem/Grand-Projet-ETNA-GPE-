// MySQL.js (Route)

const router = require('express').Router();
const InputController = require('../Controllers/InputController');
const ProcessHasInputController = require('../Controllers/ProcessHasInputController');

/*************
 * Routes Input
 ************/

router.post('/input/', InputController.create);
router.get('/input/:id/', InputController.get);
router.get('/inputs/', InputController.all);
router.patch('/input/:id/', InputController.patch);
router.delete('/input/:id/', InputController.delete);

/*************
 * Routes ProcessHasInput
 ************/
router.post('/processHasInput/', ProcessHasInputController.create);
router.get('/processHasInput/:ProcessId', ProcessHasInputController.get);
router.post('/processHasInput/byUrl', ProcessHasInputController.getbyUrl);
router.patch('/change_input/:ProcessId/:InputId', ProcessHasInputController.patch);
router.delete('/delete_input/:ProcessId/:InputId', ProcessHasInputController.delete);

module.exports = router;