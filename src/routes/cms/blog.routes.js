const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/cms/blog.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ContentSection:
 *       type: object
 *       properties:
 *         heading:
 *           type: string
 *           example: "Introduction"
 *         paragraphs:
 *           type: array
 *           items:
 *             type: string
 *           example: ["In the competitive world of sales, understanding human psychology gives you a significant advantage.", "The most successful sales professionals don't rely on manipulation or pressure tactics."]
 *       required:
 *         - heading
 *         - paragraphs
 *
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated ID
 *           example: "60d21b4667d0d8992e610c86"
 *         company_id:
 *           type: string
 *           description: ID of the company this blog belongs to
 *           example: "60d21b4667d0d8992e610c80"
 *         id:
 *           type: string
 *           description: Unique identifier for the blog
 *           example: "psychological-triggers-sales"
 *         title:
 *           type: string
 *           description: Blog title
 *           example: "7 Psychological Triggers That Drive High-Value Sales"
 *         excerpt:
 *           type: string
 *           description: Brief summary of the blog
 *           example: "Discover the key psychological principles that influence purchase decisions and learn how to ethically apply them in your sales conversations."
 *         image:
 *           type: string
 *           description: URL to the blog image
 *           example: "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology"
 *         categories:
 *           type: array
 *           description: Categories the blog belongs to (references to BlogCategory)
 *           items:
 *             $ref: '#/components/schemas/BlogCategory'
 *           example: [{ "_id": "60d21b4667d0d8992e610c87", "name": "Sales Psychology", "slug": "sales-psychology" }]
 *         category_names:
 *           type: array
 *           description: Legacy category names as strings (for backward compatibility)
 *           items:
 *             type: string
 *           example: ["Psychology", "Sales"]
 *         author:
 *           type: string
 *           description: Author of the blog
 *           example: "Michael Carson"
 *         date:
 *           type: string
 *           description: Publication date of the blog
 *           example: "Feb 12, 2024"
 *         audience:
 *           type: string
 *           description: Target audience for the blog
 *           enum: [english, french, all]
 *           default: all
 *           example: "all"
 *         htmlContent:
 *           type: string
 *           description: HTML version of the blog content
 *           example: "<h2>Introduction</h2><p>In the competitive world of sales, understanding human psychology gives you a significant advantage.</p>"
 *         content:
 *           type: array
 *           description: Sections of the blog content
 *           items:
 *             $ref: '#/components/schemas/ContentSection'
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the blog was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the blog was last updated
 *       required:
 *         - company_id
 *         - id
 *         - title
 *         - excerpt
 *         - image
 *         - author
 *         - date
 *         - content
 */

/**
 * @swagger
 * /api/cms/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
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
 *         description: Search term to filter blogs by title, excerpt, author, or content
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter blogs by category name, slug, ID, or legacy category_name
 *       - in: query
 *         name: audience
 *         schema:
 *           type: string
 *           enum: [english, french, all]
 *         description: Filter blogs by target audience (english, french, or all). If not specified, returns all content.
 *     responses:
 *       200:
 *         description: List of blogs
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
 *                   description: Number of blogs returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of matching blogs
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
 *                     $ref: '#/components/schemas/Blog'
 */
// Get all blogs
router.get('/', auth, blogController.getAllBlogs);

/**
 * @swagger
 * /api/cms/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
// Get blog by ID
router.get('/:id', auth, blogController.getBlogById);

/**
 * @swagger
 * /api/cms/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unique identifier for the blog
 *                 example: "psychological-triggers-sales"
 *               title:
 *                 type: string
 *                 description: Blog title
 *                 example: "7 Psychological Triggers That Drive High-Value Sales"
 *               excerpt:
 *                 type: string
 *                 description: Brief summary of the blog
 *                 example: "Discover the key psychological principles that influence purchase decisions and learn how to ethically apply them in your sales conversations."
 *               image:
 *                 type: string
 *                 description: URL to the blog image
 *                 example: "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology"
 *               categories:
 *                 type: array
 *                 description: Array of MongoDB IDs referencing existing categories only
 *                 items:
 *                   type: string
 *                 example: ["60d21b4667d0d8992e610c87", "60d21b4667d0d8992e610c89"]
 *               author:
 *                 type: string
 *                 description: Author of the blog
 *                 example: "Michael Carson"
 *               date:
 *                 type: string
 *                 description: Publication date of the blog
 *                 example: "Feb 12, 2024"
 *               audience:
 *                 type: string
 *                 description: Target audience for the blog
 *                 enum: [english, french, all]
 *                 default: all
 *                 example: "all"
 *               htmlContent:
 *                 type: string
 *                 description: HTML version of the blog content
 *                 example: "<h2>Introduction</h2><p>In the competitive world of sales, understanding human psychology gives you a significant advantage.</p>"
 *               content:
 *                 type: array
 *                 description: Sections of the blog content
 *                 items:
 *                   type: object
 *                   properties:
 *                     heading:
 *                       type: string
 *                       example: "Introduction"
 *                     paragraphs:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["In the competitive world of sales, understanding human psychology gives you a significant advantage.", "The most successful sales professionals don't rely on manipulation or pressure tactics."]
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid input data
 */
// Create new blog
router.post('/', auth, blogController.createBlog);

/**
 * @swagger
 * /api/cms/blogs/{id}:
 *   put:
 *     summary: Update an existing blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title
 *               excerpt:
 *                 type: string
 *                 description: Brief summary of the blog
 *               image:
 *                 type: string
 *                 description: URL to the blog image
 *               categories:
 *                 type: array
 *                 description: Array of MongoDB IDs referencing existing categories only
 *                 items:
 *                   type: string
 *                 example: ["60d21b4667d0d8992e610c87", "60d21b4667d0d8992e610c89"]
 *               author:
 *                 type: string
 *                 description: Author of the blog
 *               date:
 *                 type: string
 *                 description: Publication date of the blog
 *               audience:
 *                 type: string
 *                 description: Target audience for the blog
 *                 enum: [english, french, all]
 *                 example: "english"
 *               htmlContent:
 *                 type: string
 *                 description: HTML version of the blog content
 *                 example: "<h2>Introduction</h2><p>In the competitive world of sales, understanding human psychology gives you a significant advantage.</p>"
 *               content:
 *                 type: array
 *                 description: Sections of the blog content
 *                 items:
 *                   type: object
 *                   properties:
 *                     heading:
 *                       type: string
 *                     paragraphs:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
// Update blog
router.put('/:id', auth, blogController.updateBlog);

/**
 * @swagger
 * /api/cms/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       204:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 */
// Delete blog
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router; 