const express = require('express');
const router = express.Router();
const blogCategoryController = require('../../controllers/cms/blogCategory.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated ID
 *           example: "60d21b4667d0d8992e610c87"
 *         company_id:
 *           type: string
 *           description: ID of the company this category belongs to
 *           example: "60d21b4667d0d8992e610c80"
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Sales Psychology"
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *           example: "sales-psychology"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Articles about psychological principles in sales"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the category was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the category was last updated
 *       required:
 *         - company_id
 *         - name
 *         - slug
 */

/**
 * @swagger
 * /api/cms/blog-categories:
 *   get:
 *     summary: Get all blog categories
 *     tags: [Blog Categories]
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
 *         description: List of blog categories
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
 *                       example: 5
 *                       description: Total number of categories
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
 *                       description: Items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogCategory'
 */
// Get all blog categories
router.get('/', auth, blogCategoryController.getAllBlogCategories);

/**
 * @swagger
 * /api/cms/blog-categories/{id}:
 *   get:
 *     summary: Get blog category by ID
 *     tags: [Blog Categories]
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
 *                   $ref: '#/components/schemas/BlogCategory'
 *       404:
 *         description: Category not found
 */
// Get blog category by ID
router.get('/:id', auth, blogCategoryController.getBlogCategoryById);

/**
 * @swagger
 * /api/cms/blog-categories:
 *   post:
 *     summary: Create a new blog category
 *     tags: [Blog Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *                 example: "Sales Psychology"
 *               slug:
 *                 type: string
 *                 description: URL-friendly version of the name (optional, will be generated from name if not provided)
 *                 example: "sales-psychology"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Articles about psychological principles in sales"
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
 *                   $ref: '#/components/schemas/BlogCategory'
 *       400:
 *         description: Invalid input data
 */
// Create new blog category
router.post('/', auth, blogCategoryController.createBlogCategory);

/**
 * @swagger
 * /api/cms/blog-categories/{id}:
 *   put:
 *     summary: Update an existing blog category
 *     tags: [Blog Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               slug:
 *                 type: string
 *                 description: URL-friendly version of the name
 *               description:
 *                 type: string
 *                 description: Category description
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
 *                   $ref: '#/components/schemas/BlogCategory'
 *       404:
 *         description: Category not found
 */
// Update blog category
router.put('/:id', auth, blogCategoryController.updateBlogCategory);

/**
 * @swagger
 * /api/cms/blog-categories/{id}:
 *   delete:
 *     summary: Delete a blog category
 *     tags: [Blog Categories]
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
// Delete blog category
router.delete('/:id', auth, blogCategoryController.deleteBlogCategory);

module.exports = router; 