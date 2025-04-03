const mongoose = require('mongoose');

const courseCategorySchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a compound index for company_id and slug to ensure unique slugs per company
courseCategorySchema.index({ company_id: 1, slug: 1 }, { unique: true });

const CourseCategory = mongoose.model('CourseCategory', courseCategorySchema);

module.exports = CourseCategory; 