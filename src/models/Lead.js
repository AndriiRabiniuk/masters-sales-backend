const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
    enum: ['website', 'referral', 'event', 'social', 'direct', 'other'],
    default: 'other',
  },
  statut: {
    type: String,
    trim: true,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'new',
  },
  valeur_estimee: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead; 