const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/cms/course.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ModuleDetail:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Understanding Customer Psychology"
 *         duration:
 *           type: string
 *           example: "45 minutes"
 *       required:
 *         - title
 *         - duration
 *
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated ID
 *           example: "60d21b4667d0d8992e610c85"
 *         company_id:
 *           type: string
 *           description: ID of the company this course belongs to
 *           example: "60d21b4667d0d8992e610c80"
 *         id:
 *           type: string
 *           description: Unique identifier for the course
 *           example: "consultative-selling-masterclass"
 *         title:
 *           type: string
 *           description: Course title
 *           example: "Consultative Selling Masterclass"
 *         description:
 *           type: string
 *           description: Brief description of the course
 *           example: "Learn how to position yourself as a trusted advisor and create value through the sales process."
 *         longDescription:
 *           type: string
 *           description: Detailed description of the course
 *           example: "This comprehensive program teaches the foundations of consultative selling, from needs discovery to solution positioning. You'll learn proven frameworks used by top performers to differentiate themselves from competitors."
 *         image:
 *           type: string
 *           description: URL to the course thumbnail image
 *           example: "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling"
 *         categories:
 *           type: array
 *           description: Categories the course belongs to (references to CourseCategory)
 *           items:
 *             $ref: '#/components/schemas/CourseCategory'
 *           example: [{ "_id": "60d21b4667d0d8992e610c88", "name": "Consultative Selling", "slug": "consultative-selling" }]
 *         audience:
 *           type: string
 *           description: Target audience for the course
 *           enum: [english, french, all]
 *           default: all
 *           example: "all"
 *         level:
 *           type: string
 *           description: Difficulty level of the course
 *           example: "Intermediate"
 *         duration:
 *           type: string
 *           description: Total duration of the course
 *           example: "4 hours"
 *         modules:
 *           type: number
 *           description: Number of modules in the course
 *           example: 5
 *         learningOutcomes:
 *           type: array
 *           description: Key learning outcomes from the course
 *           items:
 *             type: string
 *           example: ["Implement a structured discovery process to uncover customer needs", "Position solutions based on business value rather than features", "Build consensus among multiple stakeholders"]
 *         moduleDetails:
 *           type: array
 *           description: Details about each module in the course
 *           items:
 *             $ref: '#/components/schemas/ModuleDetail'
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the course was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the course was last updated
 *       required:
 *         - company_id
 *         - id
 *         - title
 *         - description
 *         - longDescription
 *         - image
 *         - level
 *         - duration
 *         - modules
 *         - learningOutcomes
 *         - moduleDetails
 */

/**
 * @swagger
 * /api/cms/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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
 *         description: Search term to filter courses by title, description, or longDescription
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter courses by category name, slug, or ID
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter courses by difficulty level
 *       - in: query
 *         name: audience
 *         schema:
 *           type: string
 *           enum: [english, french, all]
 *         description: Filter courses by target audience (english, french, or all). If not specified, returns all content.
 *     responses:
 *       200:
 *         description: List of courses
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
 *                   description: Number of courses returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of matching courses
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
 *                     $ref: '#/components/schemas/Course'
 */
// Get all courses
router.get('/', auth, courseController.getAllCourses);

/**
 * @swagger
 * /api/cms/courses/levels:
 *   get:
 *     summary: Get all course levels
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all available course levels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Beginner", "Intermediate", "Advanced"]
 */
// Get all course levels - This must come BEFORE the /:id route
router.get('/levels', auth, courseController.getCourseLevels);

/**
 * @swagger
 * /api/cms/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
// Get course by ID
router.get('/:id', auth, courseController.getCourseById);

/**
 * @swagger
 * /api/cms/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
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
 *                 description: Unique identifier for the course
 *                 example: "consultative-selling-masterclass"
 *               title:
 *                 type: string
 *                 description: Course title
 *                 example: "Consultative Selling Masterclass"
 *               description:
 *                 type: string
 *                 description: Brief description of the course
 *                 example: "Learn how to position yourself as a trusted advisor and create value through the sales process."
 *               longDescription:
 *                 type: string
 *                 description: Detailed description of the course
 *                 example: "This comprehensive program teaches the foundations of consultative selling, from needs discovery to solution positioning. You'll learn proven frameworks used by top performers to differentiate themselves from competitors."
 *               image:
 *                 type: string
 *                 description: URL to the course thumbnail image
 *                 example: "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling"
 *               categories:
 *                 type: array
 *                 description: Array of MongoDB IDs referencing existing categories
 *                 items:
 *                   type: string
 *                 example: ["60d21b4667d0d8992e610c88", "60d21b4667d0d8992e610c89"]
 *               audience:
 *                 type: string
 *                 description: Target audience for the course
 *                 enum: [english, french, all]
 *                 default: all
 *                 example: "all"
 *               level:
 *                 type: string
 *                 description: Difficulty level of the course
 *                 example: "Intermediate"
 *               duration:
 *                 type: string
 *                 description: Total duration of the course
 *                 example: "4 hours"
 *               modules:
 *                 type: number
 *                 description: Number of modules in the course
 *                 example: 5
 *               learningOutcomes:
 *                 type: array
 *                 description: Key learning outcomes from the course
 *                 items:
 *                   type: string
 *                 example: ["Implement a structured discovery process to uncover customer needs", "Position solutions based on business value rather than features", "Build consensus among multiple stakeholders"]
 *               moduleDetails:
 *                 type: array
 *                 description: Details about each module in the course
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Understanding Customer Psychology"
 *                     duration:
 *                       type: string
 *                       example: "45 minutes"
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid input data
 */
// Create new course
router.post('/', auth, courseController.createCourse);

/**
 * @swagger
 * /api/cms/courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Course title
 *               description:
 *                 type: string
 *                 description: Brief description of the course
 *               longDescription:
 *                 type: string
 *                 description: Detailed description of the course
 *               image:
 *                 type: string
 *                 description: URL to the course thumbnail image
 *               categories:
 *                 type: array
 *                 description: Array of MongoDB IDs referencing existing categories
 *                 items:
 *                   type: string
 *                 example: ["60d21b4667d0d8992e610c88", "60d21b4667d0d8992e610c89"]
 *               audience:
 *                 type: string
 *                 description: Target audience for the course
 *                 enum: [english, french, all]
 *                 example: "english"
 *               level:
 *                 type: string
 *                 description: Difficulty level of the course
 *               duration:
 *                 type: string
 *                 description: Total duration of the course
 *               modules:
 *                 type: number
 *                 description: Number of modules in the course
 *               learningOutcomes:
 *                 type: array
 *                 description: Key learning outcomes from the course
 *                 items:
 *                   type: string
 *               moduleDetails:
 *                 type: array
 *                 description: Details about each module in the course
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     duration:
 *                       type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
// Update course
router.put('/:id', auth, courseController.updateCourse);

/**
 * @swagger
 * /api/cms/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
// Delete course
router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router; 