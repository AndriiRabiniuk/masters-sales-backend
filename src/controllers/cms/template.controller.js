const Template = require('../../models/Template');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

// Get all templates
exports.getAllTemplates = catchAsync(async (req, res, next) => {
  const templates = await Template.find({ company_id: req.user.company_id })
    .populate('preview_image', 'file_url')
    .populate('created_by', 'name email');

  res.status(200).json({
    status: 'success',
    results: templates.length,
    data: templates
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
  const templates = await Template.find({
    company_id: req.user.company_id,
    template_type: req.params.type
  })
    .populate('preview_image', 'file_url')
    .populate('created_by', 'name email');

  res.status(200).json({
    status: 'success',
    results: templates.length,
    data: templates
  });
});

// Get default templates
exports.getDefaultTemplates = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    company_id: req.user.company_id,
    is_default: true
  })
    .populate('preview_image', 'file_url')
    .populate('created_by', 'name email');

  res.status(200).json({
    status: 'success',
    results: templates.length,
    data: templates
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