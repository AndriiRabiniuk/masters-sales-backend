const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
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
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    trim: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
  featured_image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'password_protected'],
    default: 'public',
  },
  password: {
    type: String,
    trim: true,
  },
  publish_date: {
    type: Date,
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

// Index for faster searching
contentSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Create a compound index for company_id and slug to ensure unique slugs per company
contentSchema.index({ company_id: 1, slug: 1 }, { unique: true });

// Create automatic slug from title if not provided
contentSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  this.updated_at = Date.now();
  next();
});

// Static method to find content by status
contentSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Static method to find content by category
contentSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category_id: categoryId });
};

const Content = mongoose.model('Content', contentSchema);

module.exports = Content; 