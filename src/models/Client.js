const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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
  nom: {
    type: String,
    required: true,
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