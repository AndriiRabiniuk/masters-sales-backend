const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  featured_image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  },
  order: {
    type: Number,
    default: 0,
  },
  meta_title: {
    type: String,
    trim: true,
  },
  meta_description: {
    type: String,
    trim: true,
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
categorySchema.index({ company_id: 1, slug: 1 }, { unique: true });

// Pre-save middleware to update the updated_at timestamp
categorySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Static method to find categories by parent
categorySchema.statics.findByParent = function(parentId) {
  return this.find({ parent_id: parentId });
};

// Static method to find root categories (no parent)
categorySchema.statics.findRootCategories = function() {
  return this.find({ parent_id: null });
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 