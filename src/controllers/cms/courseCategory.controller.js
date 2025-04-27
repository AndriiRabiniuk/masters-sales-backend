const CourseCategory = require('../../models/CourseCategory');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paginateResults } = require('../../utils/paginationUtils');
const slugify = require('../../utils/slugify');

// Get all course categories
exports.getAllCourseCategories = catchAsync(async (req, res, next) => {
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
  const results = await paginateResults(CourseCategory, filter, options);
  
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

// Get course category by ID
exports.getCourseCategoryById = catchAsync(async (req, res, next) => {
  const category = await CourseCategory.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!category) {
    return next(new ApiError('Course category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category
  });
});

// Create new course category
exports.createCourseCategory = catchAsync(async (req, res, next) => {
  // Generate slug if not provided
  if (!req.body.slug && req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  
  const category = await CourseCategory.create({
    ...req.body,
    company_id: req.user.company_id
  });

  res.status(201).json({
    status: 'success',
    data: category
  });
});

// Update course category
exports.updateCourseCategory = catchAsync(async (req, res, next) => {
  // Generate slug if name is updated but slug is not provided
  if (req.body.name && !req.body.slug) {
    req.body.slug = slugify(req.body.name);
  }
  
  const category = await CourseCategory.findOneAndUpdate(
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
    return next(new ApiError('Course category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category
  });
});

// Delete course category
exports.deleteCourseCategory = catchAsync(async (req, res, next) => {
  const category = await CourseCategory.findOneAndDelete({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!category) {
    return next(new ApiError('Course category not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 