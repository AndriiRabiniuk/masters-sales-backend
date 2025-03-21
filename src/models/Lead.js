const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
    enum: ['website', 'referral', 'event'],
    default: 'website',
  },
  statut: {
    type: String,
    trim: true,
    enum: ['new', 'contacted', 'won', 'lost'],
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