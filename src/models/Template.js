const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
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
  html_structure: {
    type: String,
    required: true,
  },
  css_styles: {
    type: String,
  },
  js_scripts: {
    type: String,
  },
  template_type: {
    type: String,
    enum: ['page', 'post', 'product', 'landing_page', 'custom'],
    default: 'page',
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  preview_image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
templateSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  this.updated_at = Date.now();
  next();
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template; 