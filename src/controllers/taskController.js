const { Task, Interaction, Lead, Client } = require('../models');
const { paginateResults } = require('../utils/paginationUtils');
const asyncHandler = require('express-async-handler');

/**
 * Get all tasks
 * @route GET /api/tasks
 * @access Private
 */
const getTasks = asyncHandler(async (req, res) => {
  const { page, limit, search, status, personal } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['titre', 'description'] : [];
  
  // Get the user's company ID
  const company_id = req.user.company_id;
  
  // Find all tasks associated with the user's company:
  // 1. Get all clients in the company
  // 2. Get all leads for those clients
  // 3. Get all interactions for those leads
  // 4. Get all tasks for those interactions
  
  // Step 1: Get clients in the company
  const clients = await Client.find({ company_id });
  const clientIds = clients.map(client => client._id);
  
  // Step 2: Get leads for these clients
  const leads = await Lead.find({ client_id: { $in: clientIds } });
  const leadIds = leads.map(lead => lead._id);
  
  // Step 3: Get interactions for these leads
  const interactions = await Interaction.find({ lead_id: { $in: leadIds } });
  const interactionIds = interactions.map(interaction => interaction._id);
  
  // Prepare the query to get tasks from these interactions
  const query = { 
    interaction_id: { $in: interactionIds } 
  };
  
  // Add status filter if provided
  if (status) {
    query.statut = status;
  }
  
  // If personal filter is true, only show tasks assigned to the current user
  if (personal === 'true') {
    query.assigned_to = req.user._id;
  }
  
  // Get paginated results
  const results = await paginateResults(Task, query, {
    page,
    limit,
    search,
    searchFields,
    populate: [
      { 
        path: 'interaction_id', 
        select: 'lead_id type_interaction date_interaction',
        populate: {
          path: 'lead_id',
          select: 'name client_id',
          populate: {
            path: 'client_id',
            select: 'name'
          }
        }
      },
      { path: 'assigned_to', select: 'username email' }
    ],
    sort: { updatedAt: -1 } // Sort by due date, closest first
  });
  
  // Rename data to tasks to match desired response format
  const { data: tasks, ...rest } = results;
  
  res.json({ tasks, ...rest });
});

/**
 * Get task by ID
 * @route GET /api/tasks/:id
 * @access Private
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate({
      path: 'interaction_id',
      select: 'lead_id type_interaction date_interaction',
      populate: {
        path: 'lead_id',
        select: 'name client_id',
        populate: {
          path: 'client_id',
          select: 'name company_id'
        }
      }
    })
    .populate('assigned_to', 'username email');
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  // Check if user has permission to view this task
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = task.interaction_id.lead_id.client_id;
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }
  }
  
  res.json(task);
});

/**
 * Create a new task
 * @route POST /api/tasks
 * @access Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { interaction_id, titre, description, statut, due_date, assigned_to } = req.body;
  
  // Validate that interaction_id is provided
  if (!interaction_id) {
    res.status(400);
    throw new Error('Interaction ID is required');
  }
  
  // Verify that the interaction exists and belongs to the user's company
  const interaction = await Interaction.findById(interaction_id).populate({
    path: 'lead_id',
    populate: {
      path: 'client_id'
    }
  });
  
  if (!interaction) {
    res.status(404);
    throw new Error('Interaction not found');
  }
  
  // If not super_admin, can only create tasks for interactions in their own company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = interaction.lead_id.client_id;
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create tasks for interactions in your company');
    }
  }
  
  const task = await Task.create({
    interaction_id,
    titre,
    description,
    statut,
    due_date,
    assigned_to
  });
  
  if (task) {
    res.status(201).json(task);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});

/**
 * Update a task
 * @route PUT /api/tasks/:id
 * @access Private
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate({
    path: 'interaction_id',
    populate: {
      path: 'lead_id',
      populate: {
        path: 'client_id'
      }
    }
  });
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  // Check if user has permission to update this task
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = task.interaction_id.lead_id.client_id;
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }
  }
  
  // If interaction_id is being changed, verify that the interaction exists and user has permission
  if (req.body.interaction_id) {
    const newInteraction = await Interaction.findById(req.body.interaction_id).populate({
      path: 'lead_id',
      populate: {
        path: 'client_id'
      }
    });
    
    if (!newInteraction) {
      res.status(404);
      throw new Error('Interaction not found');
    }
    
    if (req.user.role !== 'super_admin') {
      const client = newInteraction.lead_id.client_id;
      if (client.company_id.toString() !== req.user.company_id.toString()) {
        res.status(403);
        throw new Error('Not authorized to assign task to an interaction from another company');
      }
    }
  }
  
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedTask);
});

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate({
    path: 'interaction_id',
    populate: {
      path: 'lead_id',
      populate: {
        path: 'client_id'
      }
    }
  });
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  // Check if user has permission to delete this task
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const client = task.interaction_id.lead_id.client_id;
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }
  }
  
  await task.deleteOne();
  res.json({ message: 'Task deleted' });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}; 