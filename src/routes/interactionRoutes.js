const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction
} = require('../controllers/interactionController');

/**
 * @swagger
 * tags:
 *   name: Interactions
 *   description: Client/Lead interaction management endpoints
 */

/**
 * @swagger
 * /api/interactions:
 *   get:
 *     summary: Get all interactions
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of interactions
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getInteractions);

/**
 * @swagger
 * /api/interactions/{id}:
 *   get:
 *     summary: Get interaction by ID
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interaction details
 *       404:
 *         description: Interaction not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', protect, getInteractionById);

/**
 * @swagger
 * /api/interactions:
 *   post:
 *     summary: Create a new interaction
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               client:
 *                 type: string
 *               lead:
 *                 type: string
 *     responses:
 *       201:
 *         description: Interaction created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, createInteraction);

/**
 * @swagger
 * /api/interactions/{id}:
 *   put:
 *     summary: Update an interaction
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Interaction updated
 *       404:
 *         description: Interaction not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', protect, updateInteraction);

/**
 * @swagger
 * /api/interactions/{id}:
 *   delete:
 *     summary: Delete an interaction
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interaction deleted
 *       404:
 *         description: Interaction not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', protect, deleteInteraction);

module.exports = router; 