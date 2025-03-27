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
    unique: true,
    trim: true,
    lowercase: true,
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
  },
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
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
    // Only required if visibility is password_protected
  },
  publish_date: {
    type: Date,
    default: Date.now,
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

const Content = mongoose.model('Content', contentSchema);

module.exports = Content; 