const Template = require('../../models/Template');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');

// Get all templates
exports.getAllTemplates = catchAsync(async (req, res, next) => {
  const filter = { company_id: req.user.company_id };
  
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: [
      { path: 'preview_image', select: 'file_url' },
      { path: 'created_by', select: 'name email' }
    ],
    sort: { created_at: -1 }
  };
  
  // Handle search if provided
  if (req.query.search) {
    options.search = req.query.search;
    options.searchFields = ['name', 'description', 'template_type'];
  }
  
  // Get paginated results
  const results = await paginateResults(Template, filter, options);
  
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

// Get template by ID
exports.getTemplateById = catchAsync(async (req, res, next) => {
  const template = await Template.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  })
    .populate('preview_image', 'file_url')
    .populate('created_by', 'name email');

  if (!template) {
    return next(new ApiError('Template not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: template
  });
});

// Create new template
exports.createTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.create({
    ...req.body,
    company_id: req.user.company_id,
    created_by: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: template
  });
});

// Update template
exports.updateTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findOneAndUpdate(
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

  if (!template) {
    return next(new ApiError('Template not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: template
  });
});

// Delete template
exports.deleteTemplate = catchAsync(async (req, res, next) => {
  const template = await Template.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!template) {
    return next(new ApiError('Template not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get templates by type
exports.getTemplatesByType = catchAsync(async (req, res, next) => {
  const filter = {
    company_id: req.user.company_id,
    template_type: req.params.type
  };
  
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: [
      { path: 'preview_image', select: 'file_url' },
      { path: 'created_by', select: 'name email' }
    ],
    sort: { created_at: -1 }
  };
  
  // Get paginated results
  const results = await paginateResults(Template, filter, options);
  
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

// Get default templates
exports.getDefaultTemplates = catchAsync(async (req, res, next) => {
  const filter = {
    company_id: req.user.company_id,
    is_default: true
  };
  
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    populate: [
      { path: 'preview_image', select: 'file_url' },
      { path: 'created_by', select: 'name email' }
    ],
    sort: { created_at: -1 }
  };
  
  // Get paginated results
  const results = await paginateResults(Template, filter, options);
  
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

// Set template as default
exports.setTemplateAsDefault = catchAsync(async (req, res, next) => {
  const template = await Template.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    {
      is_default: true
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!template) {
    return next(new ApiError('Template not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: template
  });
});

// Remove default status from template
exports.removeDefaultStatus = catchAsync(async (req, res, next) => {
  const template = await Template.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    {
      is_default: false
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!template) {
    return next(new ApiError('Template not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: template
  });
}); 