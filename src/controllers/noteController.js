const { Note } = require('../models');

/**
 * Get all notes
 * @route GET /api/notes
 * @access Private
 */
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('user', 'username')
      .populate('client', 'nom')
      .populate('lead', 'nom');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get note by ID
 * @route GET /api/notes/:id
 * @access Private
 */
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('user', 'username')
      .populate('client', 'nom')
      .populate('lead', 'nom');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new note
 * @route POST /api/notes
 * @access Private
 */
const createNote = async (req, res) => {
  try {
    // Add the current user as creator
    const noteData = {
      ...req.body,
      user: req.user.id
    };
    
    const newNote = await Note.create(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a note
 * @route PUT /api/notes/:id
 * @access Private
 */
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a note
 * @route DELETE /api/notes/:id
 * @access Private
 */
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
}; 