const express = require('express');
const router = express.Router();

const contentRoutes = require('./content.routes');
const categoryRoutes = require('./category.routes');
const tagRoutes = require('./tag.routes');
const templateRoutes = require('./template.routes');

// Mount all CMS routes
router.use('/content', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/templates', templateRoutes);

module.exports = router; 