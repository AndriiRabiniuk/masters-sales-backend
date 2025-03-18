const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               clientId:
 *                 type: string
 *               leadId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
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
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
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
 */
router.delete('/:id', protect, deleteNote);

module.exports = router; 