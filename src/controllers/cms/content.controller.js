const Content = require('../../models/Content');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');

// Get all content
exports.getAllContent = catchAsync(async (req, res, next) => {
  // Build filter object
  const filter = { company_id: req.user.company_id };

  // Add filters for status, category, template, etc. if provided
  if (req.query.status) filter.status = req.query.status;
  if (req.query.visibility) filter.visibility = req.query.visibility;
  if (req.query.category_id) filter.category_id = req.query.category_id;
  if (req.query.template_id) filter.template_id = req.query.template_id;
  if (req.query.author_id) filter.author_id = req.query.author_id;
  
  // Date range filters
  if (req.query.created_at_from) {
    filter.created_at = filter.created_at || {};
    filter.created_at.$gte = new Date(req.query.created_at_from);
  }
  if (req.query.created_at_to) {
    filter.created_at = filter.created_at || {};
    filter.created_at.$lte = new Date(req.query.created_at_to);
  }
  if (req.query.updated_at_from) {
    filter.updated_at = filter.updated_at || {};
    filter.updated_at.$gte = new Date(req.query.updated_at_from);
  }
  if (req.query.updated_at_to) {
    filter.updated_at = filter.updated_at || {};
    filter.updated_at.$lte = new Date(req.query.updated_at_to);
  }
  if (req.query.publish_date_from) {
    filter.publish_date = filter.publish_date || {};
    filter.publish_date.$gte = new Date(req.query.publish_date_from);
  }
  if (req.query.publish_date_to) {
    filter.publish_date = filter.publish_date || {};
    filter.publish_date.$lte = new Date(req.query.publish_date_to);
  }

  // Pagination and sort options
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: [
      { path: 'author_id', select: 'name email' },
      { path: 'category_id', select: 'name' },
      { path: 'template_id', select: 'name' },
      { path: 'featured_image', select: 'file_url' }
    ]
  };
  
  // Handle sorting
  if (req.query.sort) {
    const [field, direction] = req.query.sort.split(':');
    options.sort = { [field]: direction === 'desc' ? -1 : 1 };
  } else {
    // Default sort by publish_date descending
    options.sort = { publish_date: -1 };
  }
  
  // Handle search
  if (req.query.search) {
    options.search = req.query.search;
    options.searchFields = ['title', 'content', 'excerpt', 'meta_title', 'meta_description', 'slug'];
  }

  // Get paginated results
  const results = await paginateResults(Content, filter, options);

  // Format response
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

// Get content by ID
exports.getContentById = catchAsync(async (req, res, next) => {
  const content = await Content.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  })
    .populate('author_id', 'name email')
    .populate('category_id', 'name')
    .populate('template_id', 'name')
    .populate('featured_image', 'file_url');

  if (!content) {
    return next(new ApiError('Content not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
});

// Create new content
exports.createContent = catchAsync(async (req, res, next) => {
  const content = await Content.create({
    ...req.body,
    company_id: req.user.company_id,
    author_id: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: content
  });
});

// Update content
exports.updateContent = catchAsync(async (req, res, next) => {
  const content = await Content.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!content) {
    return next(new ApiError('Content not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
});

// Delete content
exports.deleteContent = catchAsync(async (req, res, next) => {
  const content = await Content.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!content) {
    return next(new ApiError('Content not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get content by status
exports.getContentByStatus = catchAsync(async (req, res, next) => {
  const filter = { 
    company_id: req.user.company_id,
    status: req.params.status
  };

  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: [
      { path: 'author_id', select: 'name email' },
      { path: 'category_id', select: 'name' },
      { path: 'template_id', select: 'name' },
      { path: 'featured_image', select: 'file_url' }
    ],
    sort: { publish_date: -1 }
  };

  // Get paginated results
  const results = await paginateResults(Content, filter, options);

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

// Get content by category
exports.getContentByCategory = catchAsync(async (req, res, next) => {
  const filter = { 
    company_id: req.user.company_id,
    category_id: req.params.categoryId
  };

  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: [
      { path: 'author_id', select: 'name email' },
      { path: 'category_id', select: 'name' },
      { path: 'template_id', select: 'name' },
      { path: 'featured_image', select: 'file_url' }
    ],
    sort: { publish_date: -1 }
  };

  // Get paginated results
  const results = await paginateResults(Content, filter, options);

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

// Get content by slug
exports.getContentBySlug = catchAsync(async (req, res, next) => {
  const content = await Content.findOne({
    company_id: req.user.company_id,
    slug: req.params.slug
  })
    .populate('author_id', 'name email')
    .populate('category_id', 'name')
    .populate('template_id', 'name')
    .populate('featured_image', 'file_url');

  if (!content) {
    return next(new ApiError('Content not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
});

// Publish content
exports.publishContent = catchAsync(async (req, res, next) => {
  const content = await Content.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    {
      status: 'published',
      publish_date: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!content) {
    return next(new ApiError('Content not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
});

// Archive content
exports.archiveContent = catchAsync(async (req, res, next) => {
  const content = await Content.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    {
      status: 'archived'
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!content) {
    return next(new ApiError('Content not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
}); 