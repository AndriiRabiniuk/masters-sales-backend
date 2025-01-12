const express = require('express');
const router = express.Router();
const courseCategoryController = require('../../controllers/cms/courseCategory.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated ID
 *           example: "60d21b4667d0d8992e610c88"
 *         company_id:
 *           type: string
 *           description: ID of the company this category belongs to
 *           example: "60d21b4667d0d8992e610c80"
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Sales Skills"
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *           example: "sales-skills"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Courses focused on developing essential sales skills"
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
 * /api/cms/course-categories:
 *   get:
 *     summary: Get all course categories
 *     tags: [Course Categories]
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
 *         description: List of course categories
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
 *                     $ref: '#/components/schemas/CourseCategory'
 */
// Get all course categories
router.get('/', auth, courseCategoryController.getAllCourseCategories);

/**
 * @swagger
 * /api/cms/course-categories/{id}:
 *   get:
 *     summary: Get course category by ID
 *     tags: [Course Categories]
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
 *                   $ref: '#/components/schemas/CourseCategory'
 *       404:
 *         description: Category not found
 */
// Get course category by ID
router.get('/:id', auth, courseCategoryController.getCourseCategoryById);

/**
 * @swagger
 * /api/cms/course-categories:
 *   post:
 *     summary: Create a new course category
 *     tags: [Course Categories]
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
 *                 example: "Sales Skills"
 *               slug:
 *                 type: string
 *                 description: URL-friendly version of the name (optional, will be generated from name if not provided)
 *                 example: "sales-skills"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Courses focused on developing essential sales skills"
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
 *                   $ref: '#/components/schemas/CourseCategory'
 *       400:
 *         description: Invalid input data
 */
// Create new course category
router.post('/', auth, courseCategoryController.createCourseCategory);

/**
 * @swagger
 * /api/cms/course-categories/{id}:
 *   put:
 *     summary: Update an existing course category
 *     tags: [Course Categories]
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
 *                   $ref: '#/components/schemas/CourseCategory'
 *       404:
 *         description: Category not found
 */
// Update course category
router.put('/:id', auth, courseCategoryController.updateCourseCategory);

/**
 * @swagger
 * /api/cms/course-categories/{id}:
 *   delete:
 *     summary: Delete a course category
 *     tags: [Course Categories]
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
// Delete course category
router.delete('/:id', auth, courseCategoryController.deleteCourseCategory);

module.exports = router; 