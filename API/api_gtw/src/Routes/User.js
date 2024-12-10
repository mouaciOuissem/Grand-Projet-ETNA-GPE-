// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const User = require('../Controllers/UserController');
const UserHasProcess = require('../Controllers/UserHasProcessController');

/*************
 * Routes Public
 ************/


// User
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       400:
 *         description: Invalid data
 */
router.delete('/api/user/:id/', User.delete);
/**
 * @swagger
 * /api/user/email/{id}:
 *   patch:
 *     summary: Update a user's email by ID
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update password
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: new_password123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Request has failed
 */
router.patch('/api/user/email/:id/', User.updateEmail);
/**
 * @swagger
 * /api/user/password/{id}:
 *   patch:
 *     summary: Update a user's password by ID
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update password
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: new_password123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Request has failed
 */
router.patch('/api/user/password/:id/', User.updatePassword);
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user details by id
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       503:
 *         description: Service unavailable
 *       500:
 *         description: Internal server error
 */
router.get('/api/user/', User.getSelf)
 
router.get('/api/user/:id', User.get)

// User Details
/**
 * @swagger
 * /api/details/user/:
 *   get:
 *     summary: Get self user details
 *     tags:
 *       - User Details
 *     responses:
 *       204:
 *         description: User successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       503:
 *         description: Service unavailable
 *       500:
 *         description: Internal server error
 */
router.get('/api/details/user/', User.getDetailSelf)
/**
 * @swagger
 * /api/details/user/{id}:
 *   get:
 *     summary: Get user details by id
 *     tags:
 *       - User Details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       503:
 *         description: Service unavailable
 *       500:
 *         description: Internal server error
 */
router.get('/api/details/user/:id', User.getDetailById)
/**
 * @swagger
 * /api/details/user/:
 *   patch:
 *     summary: Update self user detail
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update password
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: new_password123
 *     responses:
 *       200:
 *         description: User Details updated successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User Details not found
 */
router.patch('/api/details/user/', User.updateDetailSelf)
/**
 * @swagger
 * /api/details/user/:
 *   patch:
 *     summary: Update user detail by id
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update password
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: new_password123
 *     responses:
 *       200:
 *         description: User Details updated successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User Details not found
 */
router.patch('/api/details/user/:id', User.updateDetailById)

// UserHasProcess
router.get('/api/one_process_by_user/:id/', UserHasProcess.get);
router.get('/api/all_process_by_user/:UserId', UserHasProcess.all);

/*************
 * Routes Admin 
 ************/
// UserHasProcess
router.post('/api/assign_process_to_user/', UserHasProcess.create);
router.patch('/api/update_process_status_by_user/:id/', UserHasProcess.patch);
router.delete('/api/delete_process_do_by_user/:id/', UserHasProcess.delete);

// User
router.patch('/api/user/role/:id/', User.updateRole);
router.get('/api/users/', User.all);

module.exports = router;