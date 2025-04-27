const mongoose = require('mongoose');

const contentTagSchema = new mongoose.Schema({
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
  tag_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Create a compound index to ensure unique content-tag pairs
contentTagSchema.index({ content_id: 1, tag_id: 1 }, { unique: true });

const ContentTag = mongoose.model('ContentTag', contentTagSchema);

module.exports = ContentTag; 