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
  description: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
    enum: ['website', 'referral', 'event','outbound','inbound'],
    default: 'website',
  },
  statut: {
    type: String,
    trim: true,
    enum: ['Start-to-Call', 'Call-to-Connect', 'Connect-to-Contact', 'Contact-to-Demo', 'Demo-to-Close','Lost'],
    default: 'Start-to-Call',
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