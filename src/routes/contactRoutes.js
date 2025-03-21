const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getContacts, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact 
} = require('../controllers/contactController');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management endpoints
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [Contacts]
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
 *         description: Contact details
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to access this contact
 */
router.get('/:id', protect, getContactById);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
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
 *               - prenom
 *               - email
 *             properties:
 *               client_id:
 *                 type: string
 *                 description: ID of the client this contact belongs to (client must belong to user's company)
 *               name:
 *                 type: string
 *                 description: Last name of the contact
 *               prenom:
 *                 type: string
 *                 description: First name of the contact
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact
 *               telephone:
 *                 type: string
 *                 description: Phone number of the contact
 *               fonction:
 *                 type: string
 *                 description: Job title or function of the contact
 *     responses:
 *       201:
 *         description: Contact created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to create contacts for this client
 */
router.post('/', protect, createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
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
 *                 description: ID of the client this contact belongs to (client must belong to user's company)
 *               name:
 *                 type: string
 *                 description: Last name of the contact
 *               prenom:
 *                 type: string
 *                 description: First name of the contact
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact
 *               telephone:
 *                 type: string
 *                 description: Phone number of the contact
 *               fonction:
 *                 type: string
 *                 description: Job title or function of the contact
 *     responses:
 *       200:
 *         description: Contact updated
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this contact
 */
router.put('/:id', protect, updateContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
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
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete this contact
 */
router.delete('/:id', protect, deleteContact);

module.exports = router; 