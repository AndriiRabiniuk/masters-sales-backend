const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
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
 *   description: Interaction management endpoints
 */

/**
 * @swagger
 * /api/interactions:
 *   get:
 *     summary: Get all interactions
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lead_id
 *         schema:
 *           type: string
 *         description: Filter interactions by lead ID
 *     description: Retrieve all interactions. Regular users only get interactions for their company. Can be filtered by lead_id.
 *     responses:
 *       200:
 *         description: A list of interactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interaction'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to access interactions for this lead
 *       404:
 *         description: Lead not found
 */
router.route('/').get(protect, getInteractions);

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
 *         schema:
 *           type: string
 *         required: true
 *         description: The interaction ID
 *     description: Get a single interaction by ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the interaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interaction'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to access this interaction
 *       404:
 *         description: Interaction not found
 */
router.route('/:id').get(protect, getInteractionById);

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
 *               - lead_id
 *               - date_interaction
 *               - type_interaction
 *             properties:
 *               lead_id:
 *                 type: string
 *                 description: The ID of the lead this interaction is related to
 *               date_interaction:
 *                 type: string
 *                 format: date
 *                 description: The date of the interaction
 *               type_interaction:
 *                 type: string
 *                 description: The type of interaction (e.g. 'call', 'email', 'meeting')
 *               description:
 *                 type: string
 *                 description: Description of the interaction
 *               contact_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of contact IDs involved in this interaction
 *     responses:
 *       201:
 *         description: Interaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interaction'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to create interactions for this lead/contacts
 */
router.route('/').post(protect, createInteraction);

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
 *         schema:
 *           type: string
 *         required: true
 *         description: The interaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead_id:
 *                 type: string
 *                 description: The ID of the lead this interaction is related to
 *               date_interaction:
 *                 type: string
 *                 format: date
 *                 description: The date of the interaction
 *               type_interaction:
 *                 type: string
 *                 description: The type of interaction (e.g. 'call', 'email', 'meeting')
 *               description:
 *                 type: string
 *                 description: Description of the interaction
 *               contact_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of contact IDs involved in this interaction
 *     responses:
 *       200:
 *         description: Interaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interaction'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to update this interaction
 *       404:
 *         description: Interaction not found
 */
router.route('/:id').put(protect, updateInteraction);

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
 *         schema:
 *           type: string
 *         required: true
 *         description: The interaction ID
 *     responses:
 *       200:
 *         description: Interaction deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to delete this interaction
 *       404:
 *         description: Interaction not found
 */
router.route('/:id').delete(protect, deleteInteraction);

/**
 * @swagger
 * components:
 *   schemas:
 *     Interaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The interaction ID
 *         lead_id:
 *           type: object
 *           description: The lead associated with this interaction
 *         date_interaction:
 *           type: string
 *           format: date
 *           description: The date of the interaction
 *         type_interaction:
 *           type: string
 *           description: The type of interaction
 *         description:
 *           type: string
 *           description: Description of the interaction
 *         contacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contact'
 *           description: Contacts involved in this interaction
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the interaction was created
 */

module.exports = router; 