const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  interaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interaction',
    required: true,
  },
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  statut: {
    type: String,
    trim: true,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  due_date: {
    type: Date,
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 