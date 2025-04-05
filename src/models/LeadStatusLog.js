const mongoose = require('mongoose');

const leadStatusLogSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
  },
  previous_status: {
    type: String,
    trim: true,
  },
  new_status: {
    type: String,
    required: true,
    trim: true,
  },
  changed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  changed_at: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // Duration in milliseconds
    default: 0,
  }
}, { timestamps: true });

const LeadStatusLog = mongoose.model('LeadStatusLog', leadStatusLogSchema);

module.exports = LeadStatusLog; 