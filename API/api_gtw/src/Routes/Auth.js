// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Auth = require('../Controllers/AuthController');

/*************
 * Routes Public
 ************/

// Auth
/**
 * @swagger
 * /api/auth/login/:
 *   post:
 *     summary: POST for login
 *     tags:
 *       - Auth
 *     security:
 *       - KeycloakAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: demo-user or demo-user@test.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: User login successfully
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/api/auth/login/', Auth.login);
/**
 * @swagger
 * /api/auth/register/:
 *   post:
 *     summary: POST for register
 *     tags:
 *       - Auth
 *     security:
 *       - KeycloakAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: User created and login successfully
 *       400:
 *         description: ERR_MISSING_DATA / Invalid email or password
 *       500:
 *         description: Internal Server Error
 *       503:
 *         description: Service unavailable
 */
router.post('/api/auth/register/', Auth.register);
router.get('/api/auth/check-cookie', Auth.checkCookie);
/**
 * @swagger
 * /api/auth/logout/:
 *   post:
 *     summary: POST for logout
 *     tags:
 *       - Auth
 *     security:
 *       - KeycloakAuth: []
 *     responses:
 *       200:
 *         description: User logout successfully
 *       500:
 *         description: Internal Server Error
 *       503:
 *         description: Service unavailable
 */
router.post('/api/auth/logout', Auth.logout);

module.exports = router;