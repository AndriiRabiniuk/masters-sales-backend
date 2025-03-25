const express = require('express');
const router = express.Router();
const { 
  getLeads, 
  getLeadById, 
  createLead, 
  updateLead, 
  deleteLead 
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

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
 *         description: List of leads with their associated tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       client_id:
 *                         type: object
 *                       user_id:
 *                         type: object
 *                       statut:
 *                         type: string
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             titre:
 *                               type: string
 *                             description:
 *                               type: string
 *                             statut:
 *                               type: string
 *                             due_date:
 *                               type: string
 *                               format: date-time
 *                             assigned_to:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 email:
 *                                   type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     pages:
 *                       type: number
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
 *         description: Lead details with associated interactions and tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 client_id:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     SIREN:
 *                       type: string
 *                     SIRET:
 *                       type: string
 *                     company_id:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                 user_id:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 statut:
 *                   type: string
 *                 interactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       date_interaction:
 *                         type: string
 *                         format: date-time
 *                       type_interaction:
 *                         type: string
 *                       description:
 *                         type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       titre:
 *                         type: string
 *                       description:
 *                         type: string
 *                       statut:
 *                         type: string
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                       assigned_to:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to access this lead
 *       404:
 *         description: Lead not found
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
 *               - client_id
 *               - name
 *             properties:
 *               client_id:
 *                 type: string
 *                 description: ID of the client this lead is associated with (client must belong to user's company)
 *               name:
 *                 type: string
 *                 description: Name of the lead
 *               source:
 *                 type: string
 *                 enum: ['website', 'referral', 'event']
 *                 default: 'website'
 *                 description: Source of the lead
 *               statut:
 *                 type: string
 *                 enum: ['Start-to-Call', 'Call-to-Connect', 'Connect-to-Contact', 'Contact-to-Demo', 'Demo-to-Close']
 *                 default: 'Start-to-Call'
 *                 description: Status of the lead
 *               valeur_estimee:
 *                 type: number
 *                 description: Estimated value of the lead
 *               assigned_user_id:
 *                 type: string
 *                 description: ID of the user to assign the lead to (admin only)
 *     responses:
 *       201:
 *         description: Lead created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to create leads for this client or assign leads
 *       404:
 *         description: Client or assigned user not found
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
 *             properties:
 *               client_id:
 *                 type: string
 *                 description: ID of the client this lead is associated with (client must belong to user's company)
 *               name:
 *                 type: string
 *                 description: Name of the lead
 *               source:
 *                 type: string
 *                 enum: ['website', 'referral', 'event']
 *                 description: Source of the lead
 *               statut:
 *                 type: string
 *                 enum: ['Start-to-Call', 'Call-to-Connect', 'Connect-to-Contact', 'Contact-to-Demo', 'Demo-to-Close']
 *                 description: Status of the lead
 *               valeur_estimee:
 *                 type: number
 *                 description: Estimated value of the lead
 *               assigned_user_id:
 *                 type: string
 *                 description: ID of the user to reassign the lead to (admin only)
 *     responses:
 *       200:
 *         description: Lead updated
 *       404:
 *         description: Lead, client, or assigned user not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this lead or reassign leads
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
 *       403:
 *         description: Forbidden - Not authorized to delete this lead
 */
router.delete('/:id', protect, authorize(['super_admin', 'admin', 'manager',"sales"]), deleteLead);

module.exports = router; 