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
 *         name: sort
 *         schema:
 *           type: string
 *           example: publish_date:desc
 *         description: Field to sort by with direction (field:asc|desc)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter results
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by content status
 *       - in: query
 *         name: visibility
 *         schema:
 *           type: string
 *           enum: [public, private, password_protected]
 *         description: Filter by content visibility
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: template_id
 *         schema:
 *           type: string
 *         description: Filter by template ID
 *       - in: query
 *         name: author_id
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: created_at_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date (from)
 *       - in: query
 *         name: created_at_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date (to)
 *       - in: query
 *         name: updated_at_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by last update date (from)
 *       - in: query
 *         name: updated_at_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by last update date (to)
 *       - in: query
 *         name: publish_date_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by publish date (from)
 *       - in: query
 *         name: publish_date_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by publish date (to)
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
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Number of content items returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                       description: Total number of matching items
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 10
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
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
 *         description: Content ID
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
 *                   example: success
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
 *           example:
 *             title: "New Article Title"
 *             content: "<p>This is the main content of the article with <strong>formatting</strong> and details about the topic.</p><p>This is another paragraph with more information.</p>"
 *             excerpt: "A brief summary of the article content for preview displays and SEO."
 *             category_id: "60d21b4667d0d8992e610c85"
 *             template_id: "60d21b4667d0d8992e610c90"
 *             featured_image: "60d21b4667d0d8992e610c99"
 *             status: "draft"
 *             visibility: "public"
 *             password: null
 *             publish_date: "2023-06-15T10:00:00Z"
 *             meta_title: "SEO Title for the Article | Your Site Name"
 *             meta_description: "SEO description for search engines, including keywords and a call to action, limited to around 160 characters."
 *             slug: "new-article-title"
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
 *                   example: success
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
 *         description: Content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *           example:
 *             title: "Updated Article Title"
 *             content: "<p>Updated content of the article with improved <strong>formatting</strong> and additional details.</p><p>This paragraph contains new information not in the original version.</p>"
 *             excerpt: "Updated summary of the article content with improved keywords."
 *             category_id: "60d21b4667d0d8992e610c85"
 *             template_id: "60d21b4667d0d8992e610c90"
 *             featured_image: "60d21b4667d0d8992e610c99"
 *             status: "published"
 *             visibility: "public"
 *             password: null
 *             publish_date: "2023-06-15T10:00:00Z"
 *             meta_title: "Updated SEO Title | Your Site Name"
 *             meta_description: "Updated SEO description with better keywords and a stronger call to action."
 *             slug: "updated-article-title"
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
 *                   example: success
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
 *         description: Content ID
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
 *         description: Content status
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
 *         description: List of content items with specified status
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
 *                   description: Number of content items returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                       description: Total number of matching items
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 10
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
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
 *         description: Category ID
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
 *         description: List of content items in the specified category
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
 *                   description: Number of content items returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                       description: Total number of matching items
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 10
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
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
 *         description: URL-friendly slug to find content by
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
 *                   example: success
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
 *         description: Content ID to publish
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
 *                   example: success
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
 *         description: Content ID to archive
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
 *                   example: success
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
 *           description: The auto-generated ID of the content
 *         company_id:
 *           type: string
 *           description: ID of the company this content belongs to
 *         title:
 *           type: string
 *           description: Title of the content
 *         slug:
 *           type: string
 *           description: URL-friendly version of the title
 *         content:
 *           type: string
 *           description: Main body content
 *         excerpt:
 *           type: string
 *           description: Short summary of the content
 *         author_id:
 *           type: object
 *           description: User who created the content
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         category_id:
 *           type: object
 *           description: Category the content belongs to
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         template_id:
 *           type: object
 *           description: Template used for this content
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         featured_image:
 *           type: object
 *           description: Featured image for the content
 *           properties:
 *             _id:
 *               type: string
 *             file_url:
 *               type: string
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           description: Current status of the content
 *         visibility:
 *           type: string
 *           enum: [public, private, password_protected]
 *           description: Visibility level of the content
 *         password:
 *           type: string
 *           description: Password for protected content
 *         publish_date:
 *           type: string
 *           format: date-time
 *           description: Date when content was or will be published
 *         meta_title:
 *           type: string
 *           description: SEO title for the content
 *         meta_description:
 *           type: string
 *           description: SEO description for the content
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when content was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
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
 *           description: Title of the content
 *         content:
 *           type: string
 *           description: Main body content
 *         excerpt:
 *           type: string
 *           description: Short summary of the content
 *         category_id:
 *           type: string
 *           description: ID of the category this content belongs to
 *         template_id:
 *           type: string
 *           description: ID of the template to use for this content
 *         featured_image:
 *           type: string
 *           description: ID of the media file to use as featured image
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           description: Current status of the content
 *         visibility:
 *           type: string
 *           enum: [public, private, password_protected]
 *           description: Visibility level of the content
 *         password:
 *           type: string
 *           description: Password for protected content
 *         publish_date:
 *           type: string
 *           format: date-time
 *           description: Date when content should be published
 *         meta_title:
 *           type: string
 *           description: SEO title for the content
 *         meta_description:
 *           type: string
 *           description: SEO description for the content
 */

module.exports = router; 