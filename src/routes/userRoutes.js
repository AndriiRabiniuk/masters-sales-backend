const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (Admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users for the admin's company
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (searches in name and email)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [super_admin, admin, manager, sales, support]
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not an admin
 */
router.get('/', protect, authorize(['admin', 'super_admin',"sales"]), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not an admin or not authorized to access this user
 *       404:
 *         description: User not found
 */
router.get('/:id', protect, authorize(['admin', 'super_admin']), getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, manager, sales, support, user]
 *                 default: user
 *               company_id:
 *                 type: string
 *                 description: Only super_admin can set this field
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid data or user already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not an admin or not authorized to create this type of user
 */
router.post('/', protect, authorize(['admin', 'super_admin']), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, manager, sales, support]
 *               company_id:
 *                 type: string
 *                 description: Only super_admin can update this field
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not an admin or not authorized to update this user
 *       404:
 *         description: User not found
 */
router.put('/:id', protect, authorize(['admin', 'super_admin']), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete own account
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not an admin or not authorized to delete this user
 *       404:
 *         description: User not found
 */
router.delete('/:id', protect, authorize(['admin', 'super_admin']), deleteUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         role:
 *           type: string
 *           enum: [super_admin, admin, manager, sales, support]
 *           description: The user's role
 *         company_id:
 *           type: object
 *           description: The company this user belongs to
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 */

module.exports = router; 