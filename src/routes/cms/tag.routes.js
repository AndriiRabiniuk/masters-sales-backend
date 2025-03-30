const express = require('express');
const router = express.Router();
const tagController = require('../../controllers/cms/tag.controller');
const { authenticate: auth } = require('../../middleware/auth');

// Get all tags
router.get('/', auth, tagController.getAllTags);

// Get tag by ID
router.get('/:id', auth, tagController.getTagById);

// Create new tag
router.post('/', auth, tagController.createTag);

// Update tag
router.put('/:id', auth, tagController.updateTag);

// Delete tag
router.delete('/:id', auth, tagController.deleteTag);

// Get tags by usage count
router.get('/usage/:minCount', auth, tagController.getTagsByUsage);

// Get tags for content
router.get('/content/:contentId', auth, tagController.getTagsForContent);

// Add tag to content
router.post('/content/:contentId/tag/:tagId', auth, tagController.addTagToContent);

// Remove tag from content
router.delete('/content/:contentId/tag/:tagId', auth, tagController.removeTagFromContent);

module.exports = router; 