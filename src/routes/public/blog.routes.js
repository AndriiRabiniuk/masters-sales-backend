const express = require('express');
const router = express.Router();
const Blog = require('../../models/Blog');
const BlogCategory = require('../../models/BlogCategory');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Public Blogs
 *   description: Public API for blogs
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all public blogs
 *     tags: [Public Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter blogs by title, excerpt, author, or content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter blogs by category name, slug, or ID
 *       - in: query
 *         name: audience
 *         schema:
 *           type: string
 *           enum: [english, french, all]
 *         description: Filter blogs by target audience (english, french, or all). If not specified, returns content for all audiences.
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Number of blogs returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of matching blogs
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 1
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 */

// Get all public blogs
router.get('/', catchAsync(async (req, res, next) => {
  // No company filtering since this is public API
  const filter = {}; 
  
  // Filter by category if provided
  if (req.query.category) {
    if (mongoose.Types.ObjectId.isValid(req.query.category)) {
      // If category is a valid ObjectId, filter by category id
      filter.categories = { $in: [req.query.category] };
    } else {
      // Otherwise try to find category by name or slug
      const category = await BlogCategory.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${req.query.category}$`, 'i') } },
          { slug: req.query.category.toLowerCase().replace(/\s+/g, '-') }
        ]
      });
      
      if (category) {
        filter.categories = { $in: [category._id] };
      }
    }
  }
  
  // Filter by audience if provided
  if (req.query.audience) {
    if (['english', 'french', 'all'].includes(req.query.audience)) {
      // If audience is specified, filter by that specific audience or 'all'
      filter.$or = [
        { audience: req.query.audience },
        { audience: 'all' }
      ];
    }
  }
  
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: { created_at: -1 },
    populate: [{
      path: 'categories',
      select: 'name slug'
    }]
  };
  
  // Handle search if provided
  if (req.query.search) {
    options.search = req.query.search;
    options.searchFields = ['title', 'excerpt', 'author', 'content.heading', 'content.paragraphs', 'htmlContent'];
  }
  
  // Get paginated results
  const results = await paginateResults(Blog, filter, options);
  
  res.status(200).json({
    status: 'success',
    results: results.data.length,
    pagination: {
      total: results.total,
      page: results.page,
      pages: results.totalPages,
      limit: results.limit
    },
    data: results.data
  });
}));

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Public Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */

// Get blog by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({
    id: req.params.id
  }).populate('categories', 'name slug');

  if (!blog) {
    return next(new ApiError('Blog not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: blog
  });
}));

/**
 * @swagger
 * /api/blogs/categories:
 *   get:
 *     summary: Get all blog categories
 *     tags: [Public Blogs]
 *     responses:
 *       200:
 *         description: List of all blog categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c87"
 *                       name:
 *                         type: string
 *                         example: "Sales Psychology"
 *                       slug:
 *                         type: string
 *                         example: "sales-psychology"
 */

// Get all blog categories
router.get('/get/categories', catchAsync(async (req, res, next) => {
  const categories = await BlogCategory.find({}, 'name slug');
  
  res.status(200).json({
    status: 'success',
    data: categories
  });
}));

module.exports = router; 