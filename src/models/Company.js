const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company; 