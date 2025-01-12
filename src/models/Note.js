const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  contenu: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note; 