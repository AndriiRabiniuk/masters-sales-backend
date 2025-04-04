const express = require('express');
const router = express.Router();
const Course = require('../../models/Course');
const CourseCategory = require('../../models/CourseCategory');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Public Courses
 *   description: Public API for courses
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all public courses
 *     tags: [Public Courses]
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
 *         description: Search term to filter courses by title, description, or longDescription
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter courses by category name, slug, or ID
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter courses by difficulty level
 *       - in: query
 *         name: audience
 *         schema:
 *           type: string
 *           enum: [english, french, all]
 *         description: Filter courses by target audience (english, french, or all). If not specified, returns content for all audiences.
 *     responses:
 *       200:
 *         description: List of courses
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
 *                   description: Number of courses returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of matching courses
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
 *                     $ref: '#/components/schemas/Course'
 */

// Get all public courses
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
      const category = await CourseCategory.findOne({
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
  
  // Filter by level if provided
  if (req.query.level) {
    filter.level = req.query.level;
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
    options.searchFields = ['title', 'description', 'longDescription', 'level'];
  }
  
  // Get paginated results
  const results = await paginateResults(Course, filter, options);
  
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
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Public Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */

// Get course by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    id: req.params.id
  }).populate('categories', 'name slug');

  if (!course) {
    return next(new ApiError('Course not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: course
  });
}));

/**
 * @swagger
 * /api/courses/categories:
 *   get:
 *     summary: Get all course categories
 *     tags: [Public Courses]
 *     responses:
 *       200:
 *         description: List of all course categories
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
 *                         example: "60d21b4667d0d8992e610c88"
 *                       name:
 *                         type: string
 *                         example: "Sales Skills"
 *                       slug:
 *                         type: string
 *                         example: "sales-skills"
 */

// Get all course categories
router.get('/get/categories', catchAsync(async (req, res, next) => {
  const categories = await CourseCategory.find({}, 'name slug');
  
  res.status(200).json({
    status: 'success',
    data: categories
  });
}));

/**
 * @swagger
 * /api/courses/levels:
 *   get:
 *     summary: Get all course levels
 *     tags: [Public Courses]
 *     responses:
 *       200:
 *         description: List of all available course levels
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
 *                     type: string
 *                   example: ["Beginner", "Intermediate", "Advanced"]
 */

// Get all course levels
router.get('/levels', catchAsync(async (req, res, next) => {
  const levels = await Course.distinct('level');
  
  res.status(200).json({
    status: 'success',
    data: levels
  });
}));

module.exports = router; 