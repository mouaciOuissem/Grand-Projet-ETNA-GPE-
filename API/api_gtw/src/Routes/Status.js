// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Status = require('../Controllers/StatusController');


/*************
 * Routes Admin 
 ************/

router.post('/api/status/', Status.create);
router.get('/api/status/:id/', Status.get);
router.get('/api/status/', Status.all);
router.patch('/api/status/:id/', Status.patch);
router.delete('/api/status/:id/', Status.delete);


module.exports = router;