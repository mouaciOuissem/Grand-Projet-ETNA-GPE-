// Auth.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Data = require('../Controllers/DataController');

router.get('/list-buckets', Data.listAllBucket);
router.get('/detail-bucket/:bucketName', Data.getBucketDetails);

router.get('/list-objects/:bucketName', Data.listObjects);
router.get('/view-file/:bucketName/:fileName', Data.viewFile);

router.post('/create-bucket/', Data.createBucket);
router.delete('/delete-bucket/', Data.deleteBucket);

module.exports = router;