const mongoose = require('mongoose');

const interactionContactSchema = new mongoose.Schema({
  interaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interaction',
    required: true,
  },
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
  }
}, { timestamps: true });

// Compound index to ensure unique pairs
interactionContactSchema.index({ interaction_id: 1, contact_id: 1 }, { unique: true });

const InteractionContact = mongoose.model('InteractionContact', interactionContactSchema);

module.exports = InteractionContact; 