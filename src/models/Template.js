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
    trim: true,
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
    required: true,
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

// Create a compound index for company_id and slug to ensure unique slugs per company
templateSchema.index({ company_id: 1, slug: 1 }, { unique: true });

// Pre-save middleware to update the updated_at timestamp
templateSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Static method to find templates by type
templateSchema.statics.findByType = function(type) {
  return this.find({ template_type: type });
};

// Static method to find default templates
templateSchema.statics.findDefaultTemplates = function() {
  return this.find({ is_default: true });
};

const Template = mongoose.model('Template', templateSchema);

module.exports = Template; 