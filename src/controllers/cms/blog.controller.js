const Blog = require('../../models/Blog');
const BlogCategory = require('../../models/BlogCategory');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');
const mongoose = require('mongoose');

// Helper function to process category data
async function processCategoryData(categoryData, companyId) {
  // If no category data provided, return empty array
  if (!categoryData || !Array.isArray(categoryData) || categoryData.length === 0) {
    return [];
  }
  
  const categoryIds = [];
  
  for (const item of categoryData) {
    // Skip empty or null items
    if (!item) continue;
    
    if (mongoose.Types.ObjectId.isValid(item)) {
      // Check if the category exists
      const existingCategory = await BlogCategory.findOne({
        _id: item,
        company_id: companyId
      });
      
      if (existingCategory) {
        categoryIds.push(item);
      } else {
        console.warn(`Category with ID ${item} not found, skipping`);
      }
    } else {
      // Skip non-ObjectId values - no longer creating categories from names
      console.warn(`Invalid category ID format: ${item}, skipping`);
    }
  }
  
  return categoryIds;
}

// Get all blogs
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const filter = { company_id: req.user.company_id };
  
  // Filter by category if provided
  if (req.query.category) {
    if (mongoose.Types.ObjectId.isValid(req.query.category)) {
      // If category is a valid ObjectId, filter by category id
      filter.categories = { $in: [req.query.category] };
    } else {
      // Otherwise try to find category by name or slug
      const category = await BlogCategory.findOne({
        company_id: req.user.company_id,
        $or: [
          { name: { $regex: new RegExp(`^${req.query.category}$`, 'i') } },
          { slug: req.query.category.toLowerCase().replace(/\s+/g, '-') }
        ]
      });
      
      if (category) {
        filter.categories = { $in: [category._id] };
      } else {
        // If category not found, try matching against legacy category_names
        filter.category_names = { $in: [req.query.category] };
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
    options.searchFields = ['title', 'excerpt', 'author', 'content.heading', 'content.paragraphs'];
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
});

// Get blog by ID
exports.getBlogById = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  }).populate('categories', 'name slug');

  if (!blog) {
    return next(new ApiError('Blog not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: blog
  });
});

// Create new blog
exports.createBlog = catchAsync(async (req, res, next) => {
  // Process categories data - only valid existing IDs
  if (req.body.categories && Array.isArray(req.body.categories)) {
    req.body.categories = await processCategoryData(req.body.categories, req.user.company_id);
  }
  
  // Remove category_names processing as we no longer auto-create categories
  if (req.body.category_names) {
    delete req.body.category_names;
  }
  
  const blog = await Blog.create({
    ...req.body,
    company_id: req.user.company_id
  });

  // Populate categories for response
  await blog.populate('categories', 'name slug');

  res.status(201).json({
    status: 'success',
    data: blog
  });
});

// Update blog
exports.updateBlog = catchAsync(async (req, res, next) => {
  // Process categories data if provided - only valid existing IDs
  if (req.body.categories !== undefined) {
    if (Array.isArray(req.body.categories)) {
      req.body.categories = await processCategoryData(req.body.categories, req.user.company_id);
    } else if (req.body.categories === null) {
      // If explicitly set to null, clear categories
      req.body.categories = [];
    }
  }
  
  // Remove category_names processing as we no longer auto-create categories
  if (req.body.category_names) {
    delete req.body.category_names;
  }
  
  const blog = await Blog.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('categories', 'name slug');

  if (!blog) {
    return next(new ApiError('Blog not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: blog
  });
});

// Delete blog
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!blog) {
    return next(new ApiError('Blog not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 