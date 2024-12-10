// Routes.js (Route)

'use strict';

// Libs
const router = require('express').Router();

// Controllers
const Input = require('../Controllers/InputController');


/*************
 * Routes Admin 
 ************/

/**
 * @swagger
 * /api/input:
 *   post:
 *     summary: CREATE an INPUT
 *     tags:
 *       - Input
 *     security:
 *       - KeycloakAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: ??
 *               target:
 *                 type: string
 *                 example: ??
 *               css_target_id:
 *                 type: string
 *                 example: ??
 *     responses:
 *       201:
 *         description: Input created
 *       400:
 *         description: Request body is required and cannot be empty
 *       409:
 *         description: Input already exists
 *       500:
 *         description: Internal Server Error
 *       503:
 *         description: Service unavailable
 */
router.post('/api/input/', Input.create);
/**
 * @swagger
 * /api/input/{id}:
 *   get:
 *     summary: Get an INPUT by ID
 *     tags:
 *       - Input
 *     security:
 *       - KeycloakAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the input to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Input retrieve sucessfully
 *       400:
 *         description: Missing required parameter ID / Invalid input ID
 *       404:
 *         description: Input not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/api/input/:id/', Input.get);
router.get('/api/inputs/', Input.all);
router.patch('/api/input/:id/', Input.patch);
router.delete('/api/input/:id/', Input.delete);

module.exports = router;