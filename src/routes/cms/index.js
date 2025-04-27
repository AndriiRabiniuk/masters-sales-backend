const express = require('express');
const router = express.Router();

const contentRoutes = require('./content.routes');
const categoryRoutes = require('./category.routes');
const tagRoutes = require('./tag.routes');
const templateRoutes = require('./template.routes');
const courseRoutes = require('./course.routes');
const blogRoutes = require('./blog.routes');
const blogCategoryRoutes = require('./blogCategory.routes');
const courseCategoryRoutes = require('./courseCategory.routes');

// Mount all CMS routes
router.use('/content', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/templates', templateRoutes);
router.use('/courses', courseRoutes);
router.use('/blogs', blogRoutes);
router.use('/blog-categories', blogCategoryRoutes);
router.use('/course-categories', courseCategoryRoutes);

module.exports = router; 