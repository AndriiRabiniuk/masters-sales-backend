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
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
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

// Create automatic slug from name if not provided
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  this.updated_at = Date.now();
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 