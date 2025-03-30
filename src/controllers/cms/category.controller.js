const Category = require('../../models/Category');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

// Get all categories
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ company_id: req.user.company_id })
    .populate('featured_image', 'file_url')
    .sort('order');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories
  });
});

// Get category by ID
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  }).populate('featured_image', 'file_url');

  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category
  });
});

// Create new category
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create({
    ...req.body,
    company_id: req.user.company_id
  });

  res.status(201).json({
    status: 'success',
    data: category
  });
});

// Update category
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
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

  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category
  });
});

// Delete category
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get categories by parent
exports.getCategoriesByParent = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    company_id: req.user.company_id,
    parent_id: req.params.parentId
  })
    .populate('featured_image', 'file_url')
    .sort('order');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories
  });
});

// Get root categories
exports.getRootCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    company_id: req.user.company_id,
    parent_id: null
  })
    .populate('featured_image', 'file_url')
    .sort('order');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories
  });
});

// Update category order
exports.updateCategoryOrder = catchAsync(async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      company_id: req.user.company_id
    },
    {
      order: req.body.order
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category
  });
}); 