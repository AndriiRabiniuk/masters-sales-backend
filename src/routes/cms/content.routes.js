const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/cms/content.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * /api/cms/content:
 *   get:
 *     summary: Get all content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of content items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 */
router.get('/', auth, contentController.getAllContent);

/**
 * @swagger
 * /api/cms/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.get('/:id', auth, contentController.getContentById);

/**
 * @swagger
 * /api/cms/content:
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 */
router.post('/', auth, contentController.createContent);

/**
 * @swagger
 * /api/cms/content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *     responses:
 *       200:
 *         description: Content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.put('/:id', auth, contentController.updateContent);

/**
 * @swagger
 * /api/cms/content/{id}:
 *   delete:
 *     summary: Delete content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Content deleted successfully
 *       404:
 *         description: Content not found
 */
router.delete('/:id', auth, contentController.deleteContent);

/**
 * @swagger
 * /api/cms/content/status/{status}:
 *   get:
 *     summary: Get content by status
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: List of content items by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 */
router.get('/status/:status', auth, contentController.getContentByStatus);

/**
 * @swagger
 * /api/cms/content/category/{categoryId}:
 *   get:
 *     summary: Get content by category
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of content items by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 */
router.get('/category/:categoryId', auth, contentController.getContentByCategory);

/**
 * @swagger
 * /api/cms/content/slug/{slug}:
 *   get:
 *     summary: Get content by slug
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.get('/slug/:slug', auth, contentController.getContentBySlug);

/**
 * @swagger
 * /api/cms/content/{id}/publish:
 *   put:
 *     summary: Publish content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.put('/:id/publish', auth, contentController.publishContent);

/**
 * @swagger
 * /api/cms/content/{id}/archive:
 *   put:
 *     summary: Archive content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 */
router.put('/:id/archive', auth, contentController.archiveContent);

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         company_id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         content:
 *           type: string
 *         excerpt:
 *           type: string
 *         author_id:
 *           type: string
 *         category_id:
 *           type: string
 *         template_id:
 *           type: string
 *         featured_image:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *         visibility:
 *           type: string
 *           enum: [public, private, password_protected]
 *         password:
 *           type: string
 *         publish_date:
 *           type: string
 *           format: date-time
 *         meta_title:
 *           type: string
 *         meta_description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     ContentInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category_id
 *         - template_id
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         excerpt:
 *           type: string
 *         category_id:
 *           type: string
 *         template_id:
 *           type: string
 *         featured_image:
 *           type: string
 *         visibility:
 *           type: string
 *           enum: [public, private, password_protected]
 *         password:
 *           type: string
 *         meta_title:
 *           type: string
 *         meta_description:
 *           type: string
 */

module.exports = router; 