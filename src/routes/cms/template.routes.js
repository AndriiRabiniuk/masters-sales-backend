const express = require('express');
const router = express.Router();
const templateController = require('../../controllers/cms/template.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * /api/cms/templates:
 *   get:
 *     summary: Get all templates
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter templates by name or description
 *     responses:
 *       200:
 *         description: List of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Number of templates returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 30
 *                       description: Total number of matching templates
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 3
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 */
// Get all templates
router.get('/', auth, templateController.getAllTemplates);

/**
 * @swagger
 * /api/cms/templates/{id}:
 *   get:
 *     summary: Get template by ID
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
// Get template by ID
router.get('/:id', auth, templateController.getTemplateById);

/**
 * @swagger
 * /api/cms/templates:
 *   post:
 *     summary: Create new template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateInput'
 *           example:
 *             name: "Blog Post Template"
 *             description: "Standard template for blog posts with responsive layout and optimized for readability."
 *             html_structure: "<article class='blog-post'>\n  <header>\n    <h1>{{title}}</h1>\n    <div class='meta'>\n      <span class='date'>{{publish_date}}</span>\n      <span class='author'>By {{author}}</span>\n    </div>\n    <img src='{{featured_image}}' alt='{{title}}' class='featured-image'>\n  </header>\n  <div class='content'>\n    {{content}}\n  </div>\n  <footer>\n    <div class='tags'>{{tags}}</div>\n    <div class='share'>{{share_buttons}}</div>\n  </footer>\n</article>"
 *             css_styles: "article.blog-post {\n  max-width: 800px;\n  margin: 0 auto;\n  font-family: 'Georgia', serif;\n  line-height: 1.6;\n}\n\narticle.blog-post h1 {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.meta {\n  color: #666;\n  margin-bottom: 1.5rem;\n  font-size: 0.9rem;\n}\n\n.featured-image {\n  width: 100%;\n  height: auto;\n  margin-bottom: 2rem;\n}\n\n.content {\n  font-size: 1.1rem;\n}\n\nfooter {\n  margin-top: 2rem;\n  padding-top: 1rem;\n  border-top: 1px solid #eee;\n}"
 *             js_scripts: "document.addEventListener('DOMContentLoaded', function() {\n  console.log('Blog post template loaded');\n  \n  // Format dates\n  const dates = document.querySelectorAll('.date');\n  dates.forEach(date => {\n    const d = new Date(date.textContent);\n    date.textContent = d.toLocaleDateString('en-US', {\n      year: 'numeric',\n      month: 'long',\n      day: 'numeric'\n    });\n  });\n  \n  // Initialize share buttons\n  initShareButtons();\n});\n\nfunction initShareButtons() {\n  // Implementation would go here\n  console.log('Share buttons initialized');\n}"
 *             template_type: "post"
 *             is_default: true
 *             preview_image: "60d21b4667d0d8992e610c99"
 *             slug: "blog-post-template" # Optional - will be auto-generated from name if not provided
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 */
// Create new template
router.post('/', auth, templateController.createTemplate);

/**
 * @swagger
 * /api/cms/templates/{id}:
 *   put:
 *     summary: Update template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateInput'
 *           example:
 *             name: "Updated Blog Post Template"
 *             description: "Improved template for blog posts with better styling, dark mode support, and improved mobile responsiveness."
 *             html_structure: "<article class='blog-post'>\n  <header>\n    <h1>{{title}}</h1>\n    <div class='meta'>\n      <span class='date'>{{publish_date}}</span>\n      <span class='author'>By {{author}}</span>\n      <span class='category'>{{category}}</span>\n    </div>\n    <img src='{{featured_image}}' alt='{{title}}' class='featured-image'>\n  </header>\n  <div class='content'>\n    {{content}}\n  </div>\n  <footer>\n    <div class='tags'>{{tags}}</div>\n    <div class='related'>{{related_posts}}</div>\n    <div class='share'>{{share_buttons}}</div>\n    <div class='comments'>{{comments}}</div>\n  </footer>\n</article>"
 *             css_styles: "article.blog-post {\n  max-width: 800px;\n  margin: 0 auto;\n  font-family: 'Georgia', serif;\n  line-height: 1.6;\n  padding: 20px;\n}\n\n@media (prefers-color-scheme: dark) {\n  article.blog-post {\n    background: #222;\n    color: #eee;\n  }\n}\n\n@media (max-width: 768px) {\n  article.blog-post {\n    padding: 10px;\n  }\n}\n\narticle.blog-post h1 {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.meta {\n  color: #666;\n  margin-bottom: 1.5rem;\n  font-size: 0.9rem;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n\n.featured-image {\n  width: 100%;\n  height: auto;\n  margin-bottom: 2rem;\n  border-radius: 8px;\n}\n\n.content {\n  font-size: 1.1rem;\n}\n\nfooter {\n  margin-top: 2rem;\n  padding-top: 1rem;\n  border-top: 1px solid #eee;\n}"
 *             js_scripts: "document.addEventListener('DOMContentLoaded', function() {\n  console.log('Updated blog post template loaded');\n  \n  // Format dates\n  const dates = document.querySelectorAll('.date');\n  dates.forEach(date => {\n    const d = new Date(date.textContent);\n    date.textContent = d.toLocaleDateString('en-US', {\n      year: 'numeric',\n      month: 'long',\n      day: 'numeric'\n    });\n  });\n  \n  // Initialize share buttons with enhanced features\n  initShareButtons();\n  \n  // Add lazy loading to images\n  const images = document.querySelectorAll('img');\n  images.forEach(img => {\n    img.loading = 'lazy';\n  });\n  \n  // Initialize comments\n  initComments();\n});\n\nfunction initShareButtons() {\n  // Implementation would go here\n  console.log('Enhanced share buttons initialized');\n}\n\nfunction initComments() {\n  // Implementation would go here\n  console.log('Comments initialized');\n}"
 *             template_type: "post"
 *             is_default: true
 *             preview_image: "60d21b4667d0d8992e610c99"
 *             slug: "updated-blog-post-template" # Optional - you can customize the slug
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
// Update template
router.put('/:id', auth, templateController.updateTemplate);

/**
 * @swagger
 * /api/cms/templates/{id}:
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       204:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 */
// Delete template
router.delete('/:id', auth, templateController.deleteTemplate);

/**
 * @swagger
 * /api/cms/templates/type/{type}:
 *   get:
 *     summary: Get templates by type
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [page, post, product, landing_page, custom]
 *         description: Template type to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of templates with specified type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Number of templates returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                       description: Total number of matching templates
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 2
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 */
// Get templates by type
router.get('/type/:type', auth, templateController.getTemplatesByType);

/**
 * @swagger
 * /api/cms/templates/default:
 *   get:
 *     summary: Get default templates
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of default templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Number of templates returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of matching templates
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 1
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 */
// Get default templates
router.get('/default/all', auth, templateController.getDefaultTemplates);

/**
 * @swagger
 * /api/cms/templates/{id}/set-default:
 *   put:
 *     summary: Set template as default
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template set as default successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
// Set template as default
router.put('/:id/set-default', auth, templateController.setTemplateAsDefault);

/**
 * @swagger
 * /api/cms/templates/{id}/remove-default:
 *   put:
 *     summary: Remove default status from template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Default status removed from template successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
// Remove default status from template
router.put('/:id/remove-default', auth, templateController.removeDefaultStatus);

/**
 * @swagger
 * components:
 *   schemas:
 *     Template:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the template
 *         company_id:
 *           type: string
 *           description: ID of the company this template belongs to
 *         name:
 *           type: string
 *           description: Name of the template
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         description:
 *           type: string
 *           description: Detailed description of the template
 *         html_structure:
 *           type: string
 *           description: HTML content of the template
 *         css_styles:
 *           type: string
 *           description: CSS styles for the template
 *         js_scripts:
 *           type: string
 *           description: JavaScript code for the template
 *         template_type:
 *           type: string
 *           enum: [page, post, product, landing_page, custom]
 *           description: Type of the template
 *         is_default:
 *           type: boolean
 *           description: Whether this is a default template
 *         preview_image:
 *           type: object
 *           description: Image preview of the template
 *           properties:
 *             _id:
 *               type: string
 *             file_url:
 *               type: string
 *         created_by:
 *           type: object
 *           description: User who created the template
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when template was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *     TemplateInput:
 *       type: object
 *       required:
 *         - name
 *         - html_structure
 *         - template_type
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the template
 *         description:
 *           type: string
 *           description: Detailed description of the template
 *         html_structure:
 *           type: string
 *           description: HTML content of the template
 *         css_styles:
 *           type: string
 *           description: CSS styles for the template
 *         js_scripts:
 *           type: string
 *           description: JavaScript code for the template
 *         template_type:
 *           type: string
 *           enum: [page, post, product, landing_page, custom]
 *           description: Type of the template
 *         is_default:
 *           type: boolean
 *           description: Whether this is a default template
 *         preview_image:
 *           type: string
 *           description: ID of the media file to use as preview image
 */

module.exports = router; 