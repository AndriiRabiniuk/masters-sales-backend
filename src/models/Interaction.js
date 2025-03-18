const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  lead: {
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
    enum: ['call', 'email', 'meeting', 'demo', 'presentation', 'other'],
    default: 'other',
  },
  description: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
  }]
}, { timestamps: true });

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction; 