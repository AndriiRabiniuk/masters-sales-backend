const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
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
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Create a compound index for company_id and slug to ensure unique slugs per company
tagSchema.index({ company_id: 1, slug: 1 }, { unique: true });

// Create automatic slug from name if not provided
tagSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  this.updated_at = Date.now();
  next();
});

// Static method to find tags by usage count
tagSchema.statics.findByUsage = function(minCount = 0) {
  return this.find({ count: { $gte: minCount } });
};

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag; 