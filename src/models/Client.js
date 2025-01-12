const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
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
  marketSegment: {
    type: String,
    trim: true,
  },
  SIREN: {
    type: String,
    unique: true,
    trim: true,
  },
  SIRET: {
    type: String,
    unique: true,
    trim: true,
  },
  code_postal: {
    type: String,
    trim: true,
  },
  code_NAF: {
    type: String,
    trim: true,
  },
  chiffre_d_affaires: {
    type: Number,
  },
  EBIT: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  pdm: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client; 