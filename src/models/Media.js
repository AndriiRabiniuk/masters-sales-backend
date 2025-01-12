const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  file_url: {
    type: String,
    required: true,
    trim: true,
  },
  mime_type: {
    type: String,
    required: true,
    trim: true,
  },
  file_size: {
    type: Number,
    required: true,
  },
  alt_text: {
    type: String,
    trim: true,
  },
  caption: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  upload_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
    },
    height: {
      type: Number,
    }
  },
  media_type: {
    type: String,
    enum: ['image', 'document', 'video', 'audio'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

mediaSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Static method to find media by tags
mediaSchema.statics.findByTags = function(tags) {
  return this.find({ tags: { $in: tags } });
};

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media; 