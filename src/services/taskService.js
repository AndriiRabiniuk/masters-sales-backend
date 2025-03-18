const taskRepository = require('../repositories/taskRepository');
const interactionRepository = require('../repositories/interactionRepository');

class TaskService {
  async getAllTasks(query, options) {
    return taskRepository.findAll(query, options);
  }
  
  async getTaskById(id) {
    return taskRepository.findById(id);
  }
  
  async getTasksByInteraction(interactionId, options) {
    // Verify interaction exists
    const interaction = await interactionRepository.findById(interactionId);
    if (!interaction) {
      throw new Error('Interaction not found');
    }
    
    return taskRepository.findByInteraction(interactionId, options);
  }
  
  async getTasksByStatus(status, options) {
    // Validate status
    const validStatuses = ['pending', 'in progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    return taskRepository.findByStatus(status, options);
  }
  
  async getTasksByAssignee(assignee, options) {
    return taskRepository.findByAssignee(assignee, options);
  }
  
  async createTask(taskData) {
    // Verify interaction exists
    const interaction = await interactionRepository.findById(taskData.interaction);
    if (!interaction) {
      throw new Error('Interaction not found');
    }
    
    return taskRepository.create(taskData);
  }
  
  async updateTask(id, taskData) {
    // Verify task exists
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    // If interaction is being updated, verify it exists
    if (taskData.interaction) {
      const interaction = await interactionRepository.findById(taskData.interaction);
      if (!interaction) {
        throw new Error('Interaction not found');
      }
    }
    
    return taskRepository.update(id, taskData);
  }
  
  async updateTaskStatus(id, status) {
    // Validate status
    const validStatuses = ['pending', 'in progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    return taskRepository.update(id, { statut: status });
  }
  
  async assignTask(id, assignedTo) {
    return taskRepository.update(id, { assigned_to: assignedTo });
  }
  
  async deleteTask(id) {
    return taskRepository.delete(id);
  }
  
  async getDueTasks(options) {
    const now = new Date();
    const query = {
      due_date: { $lte: now },
      statut: { $ne: 'completed' }
    };
    
    return taskRepository.findAll(query, options);
  }
  
  async getUpcomingTasks(days = 7, options) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    const query = {
      due_date: { $gte: now, $lte: future },
      statut: { $ne: 'completed' }
    };
    
    return taskRepository.findAll(query, options);
  }
}

module.exports = new TaskService(); 