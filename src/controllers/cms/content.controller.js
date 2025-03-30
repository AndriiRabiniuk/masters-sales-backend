const Content = require('../../models/Content');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

// Get all content
exports.getAllContent = catchAsync(async (req, res, next) => {
  const content = await Content.find({ company_id: req.user.company_id })
    .populate('author_id', 'name email')
    .populate('category_id', 'name')
    .populate('template_id', 'name')
    .populate('featured_image', 'file_url');

  res.status(200).json({
    status: 'success',
    results: content.length,
    data: content
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
  const content = await Content.find({
    company_id: req.user.company_id,
    status: req.params.status
  })
    .populate('author_id', 'name email')
    .populate('category_id', 'name')
    .populate('template_id', 'name')
    .populate('featured_image', 'file_url');

  res.status(200).json({
    status: 'success',
    results: content.length,
    data: content
  });
});

// Get content by category
exports.getContentByCategory = catchAsync(async (req, res, next) => {
  const content = await Content.find({
    company_id: req.user.company_id,
    category_id: req.params.categoryId
  })
    .populate('author_id', 'name email')
    .populate('category_id', 'name')
    .populate('template_id', 'name')
    .populate('featured_image', 'file_url');

  res.status(200).json({
    status: 'success',
    results: content.length,
    data: content
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