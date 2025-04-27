const Tag = require('../../models/Tag');
const ContentTag = require('../../models/ContentTag');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');

// Get all tags
exports.getAllTags = catchAsync(async (req, res, next) => {
  const filter = { company_id: req.user.company_id };
  
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: { name: 1 }
  };
  
  // Handle search if provided
  if (req.query.search) {
    options.search = req.query.search;
    options.searchFields = ['name', 'description'];
  }
  
  // Get paginated results
  const results = await paginateResults(Tag, filter, options);
  
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

// Get tag by ID
exports.getTagById = catchAsync(async (req, res, next) => {
  const tag = await Tag.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!tag) {
    return next(new ApiError('Tag not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tag
  });
});

// Create new tag
exports.createTag = catchAsync(async (req, res, next) => {
  const tag = await Tag.create({
    ...req.body,
    company_id: req.user.company_id
  });

  res.status(201).json({
    status: 'success',
    data: tag
  });
});

// Update tag
exports.updateTag = catchAsync(async (req, res, next) => {
  const tag = await Tag.findOneAndUpdate(
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

  if (!tag) {
    return next(new ApiError('Tag not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tag
  });
});

// Delete tag
exports.deleteTag = catchAsync(async (req, res, next) => {
  const tag = await Tag.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!tag) {
    return next(new ApiError('Tag not found', 404));
  }

  // Remove all content-tag associations
  await ContentTag.deleteMany({ tag_id: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get tags by usage count
exports.getTagsByUsage = catchAsync(async (req, res, next) => {
  const filter = { 
    company_id: req.user.company_id,
    count: { $gte: parseInt(req.params.minCount) }
  };
  
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: { count: -1 } // Sort by count descending to show most popular first
  };
  
  // Get paginated results
  const results = await paginateResults(Tag, filter, options);
  
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

// Get tags for content
exports.getTagsForContent = catchAsync(async (req, res, next) => {
  const contentTags = await ContentTag.find({
    content_id: req.params.contentId
  }).populate('tag_id');

  const tags = contentTags.map(ct => ct.tag_id);

  res.status(200).json({
    status: 'success',
    results: tags.length,
    data: tags
  });
});

// Add tag to content
exports.addTagToContent = catchAsync(async (req, res, next) => {
  const contentTag = await ContentTag.create({
    content_id: req.params.contentId,
    tag_id: req.params.tagId
  });

  // Increment tag count
  await Tag.findByIdAndUpdate(req.params.tagId, {
    $inc: { count: 1 }
  });

  res.status(201).json({
    status: 'success',
    data: contentTag
  });
});

// Remove tag from content
exports.removeTagFromContent = catchAsync(async (req, res, next) => {
  const contentTag = await ContentTag.findOneAndDelete({
    content_id: req.params.contentId,
    tag_id: req.params.tagId
  });

  if (!contentTag) {
    return next(new ApiError('Content-Tag association not found', 404));
  }

  // Decrement tag count
  await Tag.findByIdAndUpdate(req.params.tagId, {
    $inc: { count: -1 }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 