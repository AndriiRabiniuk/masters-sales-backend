const { Lead, Client } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

/**
 * Get all leads
 * @route GET /api/leads
 * @access Private
 */
exports.getLeads = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['name', 'source', 'statut'] : [];
  
  // Filter by the authenticated user's company
  const user_id = req.user._id;
  
  // Prepare the base query
  const query = { user_id };
  
  // Get paginated results
  const results = await paginateResults(Lead, query, {
    page,
    limit,
    search,
    searchFields,
    populate: ['client_id'], // Populate client information
    sort: { created_at: -1 } // Sort by most recent first
  });
  
  // Rename data to leads to match desired response format
  const { data: leads, ...rest } = results;
  
  res.json({ leads, ...rest });
});

/**
 * Get lead by ID
 * @route GET /api/leads/:id
 * @access Private
 */
exports.getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate('user_id', 'name')
    .populate({
      path: 'client_id',
      select: 'name company_id',
      populate: { path: 'company_id', select: 'name' }
    });
  
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  
  // Check if user has permission to view this lead
  if (req.user.role !== 'super_admin') {
    const client = await Client.findById(lead.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this lead');
    }
  }
  
  res.json(lead);
});

/**
 * Create a new lead
 * @route POST /api/leads
 * @access Private
 */
exports.createLead = asyncHandler(async (req, res) => {
  const { client_id, name, source, statut, valeur_estimee } = req.body;
  
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
  
  // If not super_admin, can only create leads for clients in their own company
  if (req.user.role !== 'super_admin') {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create leads for clients in your own company');
    }
  }
  
  // Assign the lead to the current user
  const lead = await Lead.create({
    user_id: req.user._id,
    client_id,
    name,
    source,
    statut,
    valeur_estimee
  });
  
  if (lead) {
    res.status(201).json(lead);
  } else {
    res.status(400);
    throw new Error('Invalid lead data');
  }
});

/**
 * Update a lead
 * @route PUT /api/leads/:id
 * @access Private
 */
exports.updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  
  // Check if user has permission to update this lead
  if (req.user.role !== 'super_admin') {
    const client = await Client.findById(lead.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this lead');
    }
  }
  
  // If client_id is being changed, verify that the client exists and user has permission
  if (req.body.client_id) {
    const newClient = await Client.findById(req.body.client_id);
    if (!newClient) {
      res.status(404);
      throw new Error('Client not found');
    }
    
    if (req.user.role !== 'super_admin' && newClient.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to assign lead to a client from another company');
    }
  }
  
  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedLead);
});

/**
 * Delete a lead
 * @route DELETE /api/leads/:id
 * @access Private
 */
exports.deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  
  // Check if user has permission to delete this lead
  if (req.user.role !== 'super_admin') {
    const client = await Client.findById(lead.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this lead');
    }
  }
  
  await lead.deleteOne();
  res.json({ message: 'Lead removed' });
}); 