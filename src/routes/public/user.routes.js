const express = require('express');
const router = express.Router();
const { registerUser } = require('../../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Public Users
 *   description: Public user registration endpoint
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user (public endpoint)
 *     tags: [Public Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (must be unique)
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password (will be hashed)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 role:
 *                   type: string
 *                   description: User's role (default is 'user')
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/register', registerUser);

module.exports = router; 