const { Contact, Client } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

/**
 * Get all contacts
 * @route GET /api/contacts
 * @access Private
 */
exports.getContacts = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['name', 'prenom', 'email', 'telephone', 'fonction'] : [];
  
  // Get the user's company ID
  const company_id = req.user.company_id;
  
  // Find all clients associated with the user's company
  const clients = await Client.find({ company_id });
  const clientIds = clients.map(client => client._id);
  
  // Prepare the query to get contacts from these clients
  const query = { client_id: { $in: clientIds } };
  
  // Get paginated results
  const results = await paginateResults(Contact, query, {
    page,
    limit,
    search,
    searchFields,
    populate: {
      path: 'client_id',
      select: 'name company_id',
      populate: { path: 'company_id', select: 'name' }
    },
    sort: { created_at: -1 } // Sort by most recent first
  });
  
  // Rename data to contacts to match desired response format
  const { data: contacts, ...rest } = results;
  
  res.json({ contacts, ...rest });
});

/**
 * Get contact by ID
 * @route GET /api/contacts/:id
 * @access Private
 */
exports.getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
    .populate({
      path: 'client_id',
      select: 'name company_id',
      populate: { path: 'company_id', select: 'name' }
    });
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  // Check if user has permission to view this contact
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(contact.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this contact');
    }
  }
  
  res.json(contact);
});

/**
 * Create a new contact
 * @route POST /api/contacts
 * @access Private
 */
exports.createContact = asyncHandler(async (req, res) => {
  const { client_id, name, prenom, email, telephone, fonction } = req.body;
  
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
  
  // If not super_admin, can only create contacts for clients in their own company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create contacts for clients in your own company');
    }
  }
  
  const contact = await Contact.create({
    client_id,
    name,
    prenom,
    email,
    telephone,
    fonction
  });
  
  if (contact) {
    res.status(201).json(contact);
  } else {
    res.status(400);
    throw new Error('Invalid contact data');
  }
});

/**
 * Update a contact
 * @route PUT /api/contacts/:id
 * @access Private
 */
exports.updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  // Check if user has permission to update this contact
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(contact.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this contact');
    }
  }
  
  // If client_id is being changed, verify that the client exists and user has permission
  if (req.body.client_id) {
    const newClient = await Client.findById(req.body.client_id);
    if (!newClient) {
      res.status(404);
      throw new Error('Client not found');
    }
    
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && newClient.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to assign contact to a client from another company');
    }
  }
  
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedContact);
});

/**
 * Delete a contact
 * @route DELETE /api/contacts/:id
 * @access Private
 */
exports.deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  // Check if user has permission to delete this contact
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(contact.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this contact');
    }
  }
  
  await contact.deleteOne();
  res.json({ message: 'Contact removed' });
}); 