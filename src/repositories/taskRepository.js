const Task = require('../models/Task');

class TaskRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { due_date: 1 } } = options;
    const skip = (page - 1) * limit;
    
    const tasks = await Task.find(query)
      .populate('interaction', 'date_interaction type_interaction')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Task.countDocuments(query);
    
    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return Task.findById(id).populate('interaction', 'date_interaction type_interaction');
  }
  
  async findByInteraction(interactionId, options = {}) {
    const { page = 1, limit = 10, sort = { due_date: 1 } } = options;
    const skip = (page - 1) * limit;
    
    const tasks = await Task.find({ interaction: interactionId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Task.countDocuments({ interaction: interactionId });
    
    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findByStatus(status, options = {}) {
    const { page = 1, limit = 10, sort = { due_date: 1 } } = options;
    const skip = (page - 1) * limit;
    
    const tasks = await Task.find({ statut: status })
      .populate('interaction', 'date_interaction type_interaction')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Task.countDocuments({ statut: status });
    
    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findByAssignee(assignee, options = {}) {
    const { page = 1, limit = 10, sort = { due_date: 1 } } = options;
    const skip = (page - 1) * limit;
    
    const tasks = await Task.find({ assigned_to: assignee })
      .populate('interaction', 'date_interaction type_interaction')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Task.countDocuments({ assigned_to: assignee });
    
    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async create(taskData) {
    const task = new Task(taskData);
    return task.save();
  }
  
  async update(id, taskData) {
    return Task.findByIdAndUpdate(id, taskData, { new: true, runValidators: true });
  }
  
  async delete(id) {
    return Task.findByIdAndDelete(id);
  }
}

module.exports = new TaskRepository(); 