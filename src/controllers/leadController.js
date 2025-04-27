const { Lead, Client, Interaction, User, Task, LeadStatusLog } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

/**
 * Get all leads
 * @route GET /api/leads
 * @access Private
 */
exports.getLeads = asyncHandler(async (req, res) => {
  const { page, limit, search, client_id, personal } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['name', 'source', 'statut'] : [];
  
  // Prepare the base query
  let query = {};
  
  // If user is not super_admin, filter by company
  if (req.user.role !== 'super_admin') {
    // Get all clients for the user's company
    const companyClients = await Client.find({ company_id: req.user.company_id })
      .select('_id');
    const clientIds = companyClients.map(client => client._id);
    
    // Filter leads by client IDs
    query = { client_id: { $in: clientIds } };
  }
  
  // If personal filter is true, only show leads assigned to the current user
  if (personal === 'true') {
    query.user_id = req.user._id;
  }
  
  if (client_id) {
    query = { client_id: client_id };
  }
  
  // Get paginated results
  const results = await paginateResults(Lead, query, {
    page,
    limit,
    search,
    searchFields,
    populate: [
      { path: 'client_id' }, // Populate client information
      { path: 'user_id', select: 'name email' } // Populate user information
    ],
    sort: { created_at: -1 } // Sort by most recent first
  });
  
  // Get tasks for each lead
  const leadsWithTasks = await Promise.all(results.data.map(async (lead) => {
    const tasks = await Task.find({ interaction_id: { $in: lead.interactions || [] } })
      .populate('assigned_to', 'name email')
      .populate('interaction_id');
    
    return {
      ...lead.toObject(),
      tasks
    };
  }));
  
  // Rename data to leads to match desired response format
  const { data, ...rest } = results;
  
  res.json({ 
    leads: leadsWithTasks, 
    ...rest 
  });
});

/**
 * Get lead by ID
 * @route GET /api/leads/:id
 * @access Private
 */
exports.getLeadById = asyncHandler(async (req, res) => {
  // Find the lead by ID and populate client and user information
  const lead = await Lead.findById(req.params.id)
    .populate({
      path: 'client_id',
      select: 'name SIREN SIRET company_id',
      populate: { path: 'company_id', select: 'name' }
    })
    .populate('user_id', 'name email');
  
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  
  // Check if user has permission to view this lead
  if (req.user.role !== 'super_admin') {
    if (lead.client_id.company_id._id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this lead');
    }
  }
  
  // Get all interactions for this lead
  const interactions = await Interaction.find({ lead_id: lead._id })
    .populate('lead_id', 'name')
    .sort({ date_interaction: -1 });

  // Get all tasks associated with this lead's interactions
  const tasks = await Task.find({ interaction_id: { $in: interactions.map(i => i._id) } })
    .populate('assigned_to', 'name email')
    .populate('interaction_id')
    .sort({ due_date: 1 });
  
  // Get status logs for this lead
  const statusLogs = await LeadStatusLog.find({ lead_id: lead._id })
    .populate('changed_by', 'name email')
    .sort({ changed_at: -1 });
  
  // Combine lead data with interactions, tasks, and status logs
  const response = {
    ...lead.toObject(),
    interactions,
    tasks,
    statusLogs
  };
  
  res.json(response);
});

/**
 * Create a new lead
 * @route POST /api/leads
 * @access Private
 */
exports.createLead = asyncHandler(async (req, res) => {
  const { client_id, name, source, statut, valeur_estimee, assigned_user_id, description } = req.body;
  
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
  
  // If not super_admin or admin, can only create leads for clients in their own company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create leads for clients in your own company');
    }
  }

  // If assigned_user_id is provided, verify it exists and belongs to the same company
  let assignedUserId = req.user._id;
  if (assigned_user_id) {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Only admins can assign leads to other users');
    }
    
    const assignedUser = await User.findById(assigned_user_id);
    if (!assignedUser) {
      res.status(404);
      throw new Error('Assigned user not found');
    }
    
    if (assignedUser.company_id.toString() !== client.company_id.toString()) {
      res.status(403);
      throw new Error('Cannot assign lead to user from a different company');
    }
    
    assignedUserId = assigned_user_id;
  }
  
  // Create the lead with the assigned user
  const lead = await Lead.create({
    user_id: assignedUserId,
    client_id,
    name,
    description,
    source,
    statut,
    valeur_estimee
  });
  
  if (lead) {
    // Create initial status log
    await LeadStatusLog.create({
      lead_id: lead._id,
      previous_status: null,
      new_status: statut || 'Start-to-Call',
      changed_by: req.user._id,
      changed_at: new Date(),
      duration: 0
    });
    
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
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
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
    
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id && newClient.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to assign lead to a client from another company');
    }
  }

  // If status is changing, create a status log
  if (req.body.statut && req.body.statut !== lead.statut) {
    // Find the last status log to calculate duration
    const lastLog = await LeadStatusLog.findOne({ lead_id: lead._id })
      .sort({ changed_at: -1 });
    
    let duration = 0;
    if (lastLog) {
      duration = Date.now() - new Date(lastLog.changed_at).getTime();
    }
    
    // Create a new status log
    await LeadStatusLog.create({
      lead_id: lead._id,
      previous_status: lead.statut,
      new_status: req.body.statut,
      changed_by: req.user._id,
      changed_at: new Date(),
      duration
    });
  }
  
  // Handle lead reassignment
  if (req.body.assigned_user_id) {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Only admins can reassign leads');
    }

    const assignedUser = await User.findById(req.body.assigned_user_id);
    if (!assignedUser) {
      res.status(404);
      throw new Error('Assigned user not found');
    }

    const client = await Client.findById(lead.client_id);
    if (assignedUser.company_id.toString() !== client.company_id.toString()) {
      res.status(403);
      throw new Error('Cannot assign lead to user from a different company');
    }

    req.body.user_id = req.body.assigned_user_id;
    delete req.body.assigned_user_id;
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
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = await Client.findById(lead.client_id);
    if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this lead');
    }
  }
  
  await lead.deleteOne();
  res.json({ message: 'Lead removed' });
}); 