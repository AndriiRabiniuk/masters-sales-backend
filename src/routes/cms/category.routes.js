const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/cms/category.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * /api/cms/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Search term to filter categories by name or description
 *     responses:
 *       200:
 *         description: List of categories
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
 *                   description: Number of categories returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                       description: Total number of matching categories
 *                     page:
 *                       type: integer
 *                       example: 1
 *                       description: Current page number
 *                     pages:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of pages
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                       description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
// Get all categories
router.get('/', auth, categoryController.getAllCategories);

/**
 * @swagger
 * /api/cms/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
// Get category by ID
router.get('/:id', auth, categoryController.getCategoryById);

/**
 * @swagger
 * /api/cms/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Technology"
 *             description: "Articles about technology and innovation, including software development, AI, and hardware reviews."
 *             parent_id: null
 *             featured_image: "60d21b4667d0d8992e610c99"
 *             order: 1
 *             meta_title: "Technology Articles | Your Site Name"
 *             meta_description: "Read our latest articles about technology, innovation, and digital transformation to stay informed about industry trends."
 *             slug: "technology" # Optional - will be auto-generated from name if not provided
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 */
// Create new category
router.post('/', auth, categoryController.createCategory);

/**
 * @swagger
 * /api/cms/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Tech & Innovation"
 *             description: "Updated description for technology category covering software, hardware, AI developments, and digital transformation strategies."
 *             parent_id: "60d21b4667d0d8992e610c85" # ID of a parent category, if making this a subcategory
 *             featured_image: "60d21b4667d0d8992e610c99" # Updated featured image
 *             order: 2
 *             meta_title: "Technology & Innovation | Your Site Name"
 *             meta_description: "Explore our updated collection of tech articles covering the latest innovations, software releases, and industry insights."
 *             slug: "tech-innovation" # Optional - you can customize the slug
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
// Update category
router.put('/:id', auth, categoryController.updateCategory);

/**
 * @swagger
 * /api/cms/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
// Delete category
router.delete('/:id', auth, categoryController.deleteCategory);

/**
 * @swagger
 * /api/cms/categories/parent/{parentId}:
 *   get:
 *     summary: Get categories by parent
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent category ID
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
 *         description: List of categories with specified parent
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
 *                   description: Number of categories returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 20
 *                       description: Total number of matching categories
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
 *                     $ref: '#/components/schemas/Category'
 */
// Get categories by parent
router.get('/parent/:parentId', auth, categoryController.getCategoriesByParent);

/**
 * @swagger
 * /api/cms/categories/root:
 *   get:
 *     summary: Get root categories
 *     tags: [Categories]
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
 *         description: List of root categories
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
 *                   description: Number of categories returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 10
 *                       description: Total number of matching categories
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
 *                     $ref: '#/components/schemas/Category'
 */
// Get root categories
router.get('/root/all', auth, categoryController.getRootCategories);

/**
 * @swagger
 * /api/cms/categories/{id}/order:
 *   put:
 *     summary: Update category order
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order
 *             properties:
 *               order:
 *                 type: integer
 *                 description: New position order for the category
 *           example:
 *             order: 3
 *     responses:
 *       200:
 *         description: Category order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
// Update category order
router.put('/:id/order', auth, categoryController.updateCategoryOrder);

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the category
 *         company_id:
 *           type: string
 *           description: ID of the company this category belongs to
 *         name:
 *           type: string
 *           description: Name of the category
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         description:
 *           type: string
 *           description: Detailed description of the category
 *         parent_id:
 *           type: string
 *           description: ID of the parent category (null for root categories)
 *           nullable: true
 *         featured_image:
 *           type: object
 *           description: Image associated with the category
 *           properties:
 *             _id:
 *               type: string
 *             file_url:
 *               type: string
 *         order:
 *           type: integer
 *           description: Position order of the category
 *         meta_title:
 *           type: string
 *           description: SEO title for the category
 *         meta_description:
 *           type: string
 *           description: SEO description for the category
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when category was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the category
 *         description:
 *           type: string
 *           description: Detailed description of the category
 *         parent_id:
 *           type: string
 *           description: ID of the parent category (null for root categories)
 *           nullable: true
 *         featured_image:
 *           type: string
 *           description: ID of the media file to use as featured image
 *         order:
 *           type: integer
 *           description: Position order of the category
 *         meta_title:
 *           type: string
 *           description: SEO title for the category
 *         meta_description:
 *           type: string
 *           description: SEO description for the category
 */

module.exports = router; 