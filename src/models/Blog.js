const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Blog Schema
const BlogSchema = new Schema(
  {
    company_id: {
      type: Schema.Types.ObjectId,
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
    excerpt: {
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
      type: Schema.Types.ObjectId,
      ref: 'BlogCategory'
    }],
    author: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    audience: {
      type: String,
      enum: ['english', 'french', 'all'],
      default: 'all',
      trim: true
    },
    htmlContent: {
      type: String,
      trim: true
    },
    content: [{
      heading: {
        type: String,
        required: true,
        trim: true
      },
      paragraphs: [{
        type: String,
        required: true,
        trim: true
      }]
    }]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Create a compound index for filtering by company_id
BlogSchema.index({ company_id: 1, id: 1 }, { unique: true });

// Add text index for search functionality
BlogSchema.index({
  title: 'text',
  excerpt: 'text',
  author: 'text',
  'content.heading': 'text',
  'content.paragraphs': 'text',
  htmlContent: 'text'
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog; 