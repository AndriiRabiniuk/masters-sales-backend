const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesByClientId
} = require('../controllers/noteController');

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management endpoints
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Notes]
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
 *         description: Note details
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to access this note
 */
router.get('/:id', protect, getNoteById);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
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
 *               - contenu
 *             properties:
 *               client_id:
 *                 type: string
 *                 description: ID of the client this note is related to (client must belong to user's company)
 *               contenu:
 *                 type: string
 *                 description: Content of the note
 *     responses:
 *       201:
 *         description: Note created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to create notes for this client
 */
router.post('/', protect, createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
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
 *                 description: ID of the client this note is related to (client must belong to user's company)
 *               contenu:
 *                 type: string
 *                 description: Content of the note
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this note
 */
router.put('/:id', protect, updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
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
 *         description: Note deleted
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete this note
 */
router.delete('/:id', protect, deleteNote);

/**
 * @swagger
 * /api/notes/client/{clientId}:
 *   get:
 *     summary: Get all notes for a specific client
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the client to get notes for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter notes
 *     responses:
 *       200:
 *         description: List of notes for the client
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to access notes for this client
 *       404:
 *         description: Client not found
 */
router.get('/client/:clientId', protect, getNotesByClientId);

module.exports = router; 