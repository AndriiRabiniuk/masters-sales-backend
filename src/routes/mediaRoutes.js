const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    uploadMedia,
    getMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    getSignedUploadUrl,
    completeDirectUpload
} = require('../controllers/mediaController');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Upload a new media file
 *     description: Upload a file to S3 and create a media record
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (max 10MB)
 *               title:
 *                 type: string
 *                 description: Title for the media
 *               alt_text:
 *                 type: string
 *                 description: Alternative text for the media (for accessibility)
 *               caption:
 *                 type: string
 *                 description: Caption for the media
 *               description:
 *                 type: string
 *                 description: Description of the media
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *     responses:
 *       201:
 *         description: Media uploaded successfully
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
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     title:
 *                       type: string
 *                       example: Sample Image
 *                     file_url:
 *                       type: string
 *                       example: https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg
 *       400:
 *         description: No file uploaded or invalid request
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error or AWS S3 error
 */
router.post('/', protect, upload.single('file'), uploadMedia);

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media files with pagination
 *     description: Retrieves a paginated list of media files with filtering options
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: media_type
 *         schema:
 *           type: string
 *           enum: [image, document, video, audio]
 *         description: Filter by media type
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, description, alt_text, or caption
 *     responses:
 *       200:
 *         description: List of media files
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
 *                   example: 5
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error
 */
router.get('/', protect, getMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get a single media file by ID
 *     description: Retrieves detailed information about a specific media file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media file details
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
 *       400:
 *         description: Invalid media ID format
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Media not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getMediaById);

/**
 * @swagger
 * /api/media/{id}:
 *   put:
 *     summary: Update media metadata
 *     description: Updates metadata for an existing media file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the media
 *               alt_text:
 *                 type: string
 *                 description: New alternative text
 *               caption:
 *                 type: string
 *                 description: New caption
 *               description:
 *                 type: string
 *                 description: New description
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *     responses:
 *       200:
 *         description: Media updated successfully
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
 *       400:
 *         description: Invalid media ID format
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Media not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, updateMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete a media file
 *     description: Deletes a media file from S3 and removes its record from the database
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Media deleted successfully
 *       400:
 *         description: Invalid media ID format
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Media not found
 *       500:
 *         description: Server error or AWS S3 error
 */
router.delete('/:id', protect, deleteMedia);

/**
 * @swagger
 * /api/media/signed-url:
 *   get:
 *     summary: Get a signed URL for direct S3 upload
 *     description: Generates a pre-signed URL for direct client-to-S3 upload
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Original filename
 *       - in: query
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *         description: MIME type of the file
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
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
 *                     signedUrl:
 *                       type: string
 *                       example: https://bucket-name.s3.region.amazonaws.com/media/company_id/filename?X-Amz-Algorithm=...
 *                     fileUrl:
 *                       type: string
 *                       example: https://bucket-name.s3.region.amazonaws.com/media/company_id/filename
 *                     key:
 *                       type: string
 *                       example: media/company_id/filename
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error or AWS S3 error
 */
router.get('/signed-url', protect, getSignedUploadUrl);

/**
 * @swagger
 * /api/media/complete-upload:
 *   post:
 *     summary: Complete a direct S3 upload
 *     description: Creates a media record after successful direct upload to S3
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - fileUrl
 *               - title
 *               - fileSize
 *               - mimeType
 *             properties:
 *               key:
 *                 type: string
 *                 description: S3 key of the uploaded file
 *               fileUrl:
 *                 type: string
 *                 description: Full URL to the uploaded file
 *               title:
 *                 type: string
 *                 description: Title for the media
 *               fileSize:
 *                 type: number
 *                 description: Size of the file in bytes
 *               mimeType:
 *                 type: string
 *                 description: MIME type of the file
 *               altText:
 *                 type: string
 *                 description: Alternative text for the media
 *               caption:
 *                 type: string
 *                 description: Caption for the media
 *               description:
 *                 type: string
 *                 description: Description of the media
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *     responses:
 *       201:
 *         description: Media record created successfully
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
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Server error
 */
router.post('/complete-upload', protect, completeDirectUpload);

module.exports = router; 