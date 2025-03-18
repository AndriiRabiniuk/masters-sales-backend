const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getLeads, 
  getLeadById, 
  createLead, 
  updateLead, 
  deleteLead 
} = require('../controllers/leadController');

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management endpoints
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leads
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getLeads);

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     summary: Get lead by ID
 *     tags: [Leads]
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
 *         description: Lead details
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', protect, getLeadById);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *             properties:
 *               nom:
 *                 type: string
 *               entreprise:
 *                 type: string  
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               source:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']
 *                 default: 'new'
 *     responses:
 *       201:
 *         description: Lead created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, createLead);

/**
 * @swagger
 * /api/leads/{id}:
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
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
 *         description: Lead updated
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', protect, updateLead);

/**
 * @swagger
 * /api/leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
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
 *         description: Lead deleted
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', protect, deleteLead);

module.exports = router; 