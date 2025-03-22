const { Task } = require('../models');
const { paginateResults } = require('../utils/paginationUtils');
const asyncHandler = require('express-async-handler');

/**
 * Get all tasks
 * @route GET /api/tasks
 * @access Private
 */
const getTasks = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['title', 'description'] : [];
  
  // Filter by the authenticated user's tasks
  const createdBy = req.user._id;
  
  // Prepare the base query
  const query = { createdBy };
  
  // Add status filter if provided
  if (status) {
    query.status = status;
  }
  
  // Get paginated results
  const results = await paginateResults(Task, query, {
    page,
    limit,
    search,
    searchFields,
    populate: ['assignedTo', 'client', 'lead'], // Populate related information
    sort: { dueDate: 1 } // Sort by due date, closest first
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
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username')
      .populate('client', 'nom')
      .populate('lead', 'nom');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new task
 * @route POST /api/tasks
 * @access Private
 */
const createTask = async (req, res) => {
  try {
    // Add the current user as creator
    const taskData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const newTask = await Task.create(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a task
 * @route PUT /api/tasks/:id
 * @access Private
 */
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}; 