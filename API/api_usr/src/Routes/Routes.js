// Auth.js (Route)

const router = require('express').Router();
const User = require('../Controllers/UserController');
const UserDetails = require('../Controllers/UserDetailsController');
const Security = require('../Services/SecurityService');


/*************
 * Routes User
 ************/

router.delete('/user/:id/', Security.userHeaderToReqUser, User.delete);
router.patch('/user/email/:id/', Security.userHeaderToReqUser, User.updateEmail);
router.patch('/user/password/:id/', Security.userHeaderToReqUser, User.updatePassword);
// router.get('/user/:id/', Security.userHeaderToReqUser, User.findOne);
router.get('/user/:id/', User.findOne);

/*************
 * Routes User Details
 ************/

router.get('/user/details/:UserdetailsId', Security.userHeaderToReqUser, UserDetails.findOne);
router.get('/user/self/details/:UserdetailsId', Security.userHeaderToReqUser, UserDetails.findSelf);
router.patch('/user/details/:UserdetailsId', Security.userHeaderToReqUser, UserDetails.update);
router.patch('/user/self/details/:UserdetailsId', Security.userHeaderToReqUser, UserDetails.Selfupdate);

/*************
 * Routes Admin-User
 ************/

router.patch('/user/role/:id/', Security.userHeaderToReqUser, User.updateRole);
router.get('/users/', User.all);

module.exports = router;