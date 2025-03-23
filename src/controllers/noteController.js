const { Note, Client } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

/**
 * Get all notes
 * @route GET /api/notes
 * @access Private
 */
exports.getNotes = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['contenu'] : [];
  
  // Get the user's company_id
  const userCompanyId = req.user.company_id;
  
  // Find all clients that belong to the user's company
  const clients = await Client.find({ company_id: userCompanyId }).select('_id');
  const clientIds = clients.map(client => client._id);
  
  // Prepare the query to filter notes by clients belonging to user's company
  const query = { client_id: { $in: clientIds } };
  
  // Get paginated results
  const results = await paginateResults(Note, query, {
    page,
    limit,
    search,
    searchFields,
    populate: [
      { path: 'client_id', select: 'name SIREN SIRET' }
    ],
    sort: { created_at: -1 } // Sort by most recent first
  });
  
  // Rename data to notes to match desired response format
  const { data: notes, ...rest } = results;
  
  res.json({ notes, ...rest });
});

/**
 * Get note by ID
 * @route GET /api/notes/:id
 * @access Private
 */
exports.getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)
    .populate({
      path: 'client_id',
      select: 'name company_id',
      populate: { path: 'company_id', select: 'name' }
    });
  
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  
  // Check if user has permission to view this note
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(note.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this note');
    }
  }
  
  res.json(note);
});

/**
 * Create a new note
 * @route POST /api/notes
 * @access Private
 */
exports.createNote = asyncHandler(async (req, res) => {
  const { client_id, contenu } = req.body;
  
  // Validate that client_id is provided
  if (!client_id) {
    res.status(400);
    throw new Error('Client ID is required');
  }
  
  // Verify that the client exists and belongs to the user's company
  const client = await Client.findById(client_id);
  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }
  
  // If not super_admin, can only create notes for clients in their own company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create notes for clients in your own company');
    }
  }
  
  const note = await Note.create({
    client_id,
    contenu
  });
  
  if (note) {
    res.status(201).json(note);
  } else {
    res.status(400);
    throw new Error('Invalid note data');
  }
});

/**
 * Update a note
 * @route PUT /api/notes/:id
 * @access Private
 */
exports.updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  
  // Check if user has permission to update this note
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(note.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this note');
    }
  }
  
  // If client_id is being changed, verify that the client exists and user has permission
  if (req.body.client_id) {
    const newClient = await Client.findById(req.body.client_id);
    if (!newClient) {
      res.status(404);
      throw new Error('Client not found');
    }
    
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id && newClient.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to assign note to a client from another company');
    }
  }
  
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedNote);
});

/**
 * Delete a note
 * @route DELETE /api/notes/:id
 * @access Private
 */
exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  
  // Check if user has permission to delete this note
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(note.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this note');
    }
  }
  
  await note.deleteOne();
  res.json({ message: 'Note removed' });
});

/**
 * Get notes by client ID
 * @route GET /api/notes/client/:clientId
 * @access Private
 */
exports.getNotesByClientId = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const { page, limit, search } = req.query;
  
  // Find the client and verify it exists
  const client = await Client.findById(clientId);
  
  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }
  
  // Verify the client belongs to the user's company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id && client.company_id.toString() !== req.user.company_id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access notes for this client');
  }
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['contenu'] : [];
  
  // Prepare the query to filter notes by the specific client
  const query = { client_id: clientId };
  
  // Get paginated results
  const results = await paginateResults(Note, query, {
    page,
    limit,
    search,
    searchFields,
    sort: { created_at: -1 } // Sort by most recent first
  });
  
  // Rename data to notes to match desired response format
  const { data: notes, ...rest } = results;
  
  res.json({ notes, ...rest });
}); 