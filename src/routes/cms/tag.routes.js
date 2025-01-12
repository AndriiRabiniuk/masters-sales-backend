const express = require('express');
const router = express.Router();
const tagController = require('../../controllers/cms/tag.controller');
const { authenticate: auth } = require('../../middleware/auth');

/**
 * @swagger
 * /api/cms/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
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
 *         description: Search term to filter tags by name or description
 *     responses:
 *       200:
 *         description: List of tags
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
 *                   description: Number of tags returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 45
 *                       description: Total number of matching tags
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
 *                     $ref: '#/components/schemas/Tag'
 */
// Get all tags
router.get('/', auth, tagController.getAllTags);

/**
 * @swagger
 * /api/cms/tags/{id}:
 *   get:
 *     summary: Get tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
// Get tag by ID
router.get('/:id', auth, tagController.getTagById);

/**
 * @swagger
 * /api/cms/tags:
 *   post:
 *     summary: Create new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *           example:
 *             name: "JavaScript"
 *             description: "Articles related to JavaScript programming"
 *             slug: "javascript"
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 */
// Create new tag
router.post('/', auth, tagController.createTag);

/**
 * @swagger
 * /api/cms/tags/{id}:
 *   put:
 *     summary: Update tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *           example:
 *             name: "JavaScript ES6+"
 *             description: "Modern JavaScript features and best practices"
 *             slug: "javascript-es6-plus"
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
// Update tag
router.put('/:id', auth, tagController.updateTag);

/**
 * @swagger
 * /api/cms/tags/{id}:
 *   delete:
 *     summary: Delete tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       204:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 */
// Delete tag
router.delete('/:id', auth, tagController.deleteTag);

/**
 * @swagger
 * /api/cms/tags/usage/{minCount}:
 *   get:
 *     summary: Get tags by usage count
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: minCount
 *         required: true
 *         schema:
 *           type: integer
 *         description: Minimum usage count threshold
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
 *         description: List of tags with usage count greater than or equal to minCount
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
 *                   description: Number of tags returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                       description: Total number of matching tags
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
 *                       description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 */
// Get tags by usage count
router.get('/usage/:minCount', auth, tagController.getTagsByUsage);

/**
 * @swagger
 * /api/cms/tags/content/{contentId}:
 *   get:
 *     summary: Get tags for content
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to get associated tags
 *     responses:
 *       200:
 *         description: List of tags for the specified content
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
 *                   description: Number of tags returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 */
// Get tags for content
router.get('/content/:contentId', auth, tagController.getTagsForContent);

/**
 * @swagger
 * /api/cms/tags/content/{contentId}/tag/{tagId}:
 *   post:
 *     summary: Add tag to content
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to add tag to
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID to add to content
 *     responses:
 *       201:
 *         description: Tag added to content successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     content_id:
 *                       type: string
 *                     tag_id:
 *                       type: string
 *       404:
 *         description: Content or tag not found
 */
// Add tag to content
router.post('/content/:contentId/tag/:tagId', auth, tagController.addTagToContent);

/**
 * @swagger
 * /api/cms/tags/content/{contentId}/tag/{tagId}:
 *   delete:
 *     summary: Remove tag from content
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to remove tag from
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID to remove from content
 *     responses:
 *       204:
 *         description: Tag removed from content successfully
 *       404:
 *         description: Content or tag not found
 */
// Remove tag from content
router.delete('/content/:contentId/tag/:tagId', auth, tagController.removeTagFromContent);

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the tag
 *         company_id:
 *           type: string
 *           description: ID of the company this tag belongs to
 *         name:
 *           type: string
 *           description: Name of the tag
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         description:
 *           type: string
 *           description: Detailed description of the tag
 *         count:
 *           type: integer
 *           description: Usage count of the tag
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when tag was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *     TagInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the tag
 *         description:
 *           type: string
 *           description: Detailed description of the tag
 */

module.exports = router; 