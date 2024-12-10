// MySQL.js (Route)

const router = require('express').Router();
const UserController = require('../Controllers/UserController');
const UserDetailsController = require('../Controllers/UserDetailsController');

/*************
 * Routes User
 ************/

router.get('/user/:id/', UserController.get);
router.patch('/user/email/:id/', UserController.patchEmail);
router.patch('/user/password/:id/', UserController.patchPassword);
router.delete('/user/:id/', UserController.delete);

/*************
 * Routes Admin User
 ************/

router.get('/users/', UserController.all);
router.patch('/user/role/:id/', UserController.patchRole);


/*************
 * Routes User Detail
 ************/

// User details
router.get('/user/details/:id', UserDetailsController.get);
router.patch('/user/details/:id', UserDetailsController.patch);

module.exports = router;