// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Data = require('../Controllers/DataController');

router.get('/api/bckt/list-bucket', Data.listAllBucket);
router.get('/api/bckt/detail-bucket/:bucketName', Data.getBucketDetails);

router.get('/api/bckt/list-objects/:bucketName', Data.listObjects);
router.get('/api/bckt/view-file/:bucketName/:fileName', Data.viewFile);

// router.post('/api/bckt/create-bucket', CreateBucket.create);

module.exports = router;