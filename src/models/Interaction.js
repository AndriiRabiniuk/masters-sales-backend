const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
  },
  date_interaction: {
    type: Date,
    default: Date.now,
  },
  type_interaction: {
    type: String,
    trim: true,
    enum: ['call', 'email', 'meeting'],
    default: 'call',
  },
  description: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction; 