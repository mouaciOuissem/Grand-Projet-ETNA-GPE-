// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Process = require('../Controllers/ProcessController');
const ProcessHasInput = require('../Controllers/ProcessHasInputController');
const ProcessUserInformations = require('../Controllers/ProcessUserInformationsController');

/*************
 * Routes Admin 
 ************/

// Process

router.post('/api/process/', Process.create);
/**
 * @swagger
 * /api/process/{id}/:
 *   get:
 *     summary: Get a process by ID
 *     tags:
 *       - Process
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the input to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Input retrieved successfully
 *       400:
 *         description: Invalid input ID
 *       404:
 *         description: input not found
 *       503:
 *         description: Service unavailable
 *       500:
 *         description: Internal server error
 */
router.get('/api/process/:id/', Process.get);
router.get('/api/process/', Process.all);
router.get('/api/url/process/', Process.allUrl);
router.patch('/api/process/:id/', Process.patch);
router.delete('/api/process/:id/', Process.delete);

//Process has input 

router.post('/api/assign_input_to_process/', ProcessHasInput.create);
router.get('/api/process/information/:ProcessId/', ProcessHasInput.get);
router.post('/api/process/user/information/', ProcessUserInformations.formatedData);
router.patch('/api/change_input/:ProcessId/:InputId', ProcessHasInput.patch);
router.delete('/api/delete_input/:ProcessId/:InputId', ProcessHasInput.delete);



module.exports = router;