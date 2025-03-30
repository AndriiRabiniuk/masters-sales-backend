const express = require('express');
const router = express.Router();
const templateController = require('../../controllers/cms/template.controller');
const { authenticate: auth } = require('../../middleware/auth');

// Get all templates
router.get('/', auth, templateController.getAllTemplates);

// Get template by ID
router.get('/:id', auth, templateController.getTemplateById);

// Create new template
router.post('/', auth, templateController.createTemplate);

// Update template
router.put('/:id', auth, templateController.updateTemplate);

// Delete template
router.delete('/:id', auth, templateController.deleteTemplate);

// Get templates by type
router.get('/type/:type', auth, templateController.getTemplatesByType);

// Get default templates
router.get('/default/all', auth, templateController.getDefaultTemplates);

// Set template as default
router.put('/:id/set-default', auth, templateController.setTemplateAsDefault);

// Remove default status from template
router.put('/:id/remove-default', auth, templateController.removeDefaultStatus);

module.exports = router; 