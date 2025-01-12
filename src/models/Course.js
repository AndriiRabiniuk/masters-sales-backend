const mongoose = require('mongoose');

const moduleDetailSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  }
});

const courseSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseCategory'
  }],
  audience: {
    type: String,
    enum: ['english', 'french', 'all'],
    default: 'all',
    trim: true
  },
  level: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  modules: {
    type: Number,
    required: true
  },
  learningOutcomes: [{
    type: String,
    required: true,
    trim: true
  }],
  moduleDetails: [moduleDetailSchema],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 