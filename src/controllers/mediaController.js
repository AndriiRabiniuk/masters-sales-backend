const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const asyncHandler = require('express-async-handler');
const Media = require('../models/Media');
const mongoose = require('mongoose');
const path = require('path');
const sharp = require('sharp');

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Helper function to determine media type from mime type
const getMediaType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
};

// Helper function to get image dimensions
const getImageDimensions = async (buffer) => {
    try {
        const metadata = await sharp(buffer).metadata();
        return {
            width: metadata.width,
            height: metadata.height
        };
    } catch (error) {
        console.error('Error getting image dimensions:', error);
        return null;
    }
};

// @desc    Upload a media file
// @route   POST /api/media
// @access  Private
const uploadMedia = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    // Generate unique key for S3
    const file = req.file;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    const key = `media/${req.user.company_id}/${fileName}`;

    // Determine media type based on mimetype
    const mediaType = getMediaType(file.mimetype);

    // Get dimensions if it's an image
    let dimensions = null;
    if (mediaType === 'image') {
        dimensions = await getImageDimensions(file.buffer);
    }

    try {
        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        });

        await s3Client.send(command);
        
        // Create media record in database
        const media = await Media.create({
            company_id: req.user.company_id,
            title: req.body.title || file.originalname,
            file_url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            mime_type: file.mimetype,
            file_size: file.size,
            alt_text: req.body.alt_text || '',
            caption: req.body.caption || '',
            description: req.body.description || '',
            upload_by: req.user._id,
            dimensions: dimensions,
            media_type: mediaType,
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
        });

        res.status(201).json({
            status: 'success',
            data: media
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500);
        throw new Error(`Error uploading file: ${error.message}`);
    }
});

// @desc    Get all media files with pagination
// @route   GET /api/media
// @access  Private
const getMedia = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { company_id: req.user.company_id };

    // Filter by media type if provided
    if (req.query.media_type) {
        filter.media_type = req.query.media_type;
    }

    // Filter by tags if provided
    if (req.query.tags) {
        const tags = req.query.tags.split(',').map(tag => tag.trim());
        filter.tags = { $in: tags };
    }

    // Search by title, description, or alt_text
    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } },
            { alt_text: { $regex: req.query.search, $options: 'i' } },
            { caption: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    // Get total count for pagination
    const total = await Media.countDocuments(filter);

    // Get media files with pagination
    const media = await Media.find(filter)
        .populate('upload_by', 'name email')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        status: 'success',
        results: media.length,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
        },
        data: media
    });
});

// @desc    Get single media file
// @route   GET /api/media/:id
// @access  Private
const getMediaById = asyncHandler(async (req, res) => {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid media ID');
    }

    const media = await Media.findOne({
        _id: req.params.id,
        company_id: req.user.company_id
    }).populate('upload_by', 'name email');

    if (!media) {
        res.status(404);
        throw new Error('Media not found');
    }

    res.status(200).json({
        status: 'success',
        data: media
    });
});

// @desc    Update media metadata
// @route   PUT /api/media/:id
// @access  Private
const updateMedia = asyncHandler(async (req, res) => {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid media ID');
    }

    // Find media
    const media = await Media.findOne({
        _id: req.params.id,
        company_id: req.user.company_id
    });

    if (!media) {
        res.status(404);
        throw new Error('Media not found');
    }

    // Update fields
    const updatedFields = {
        title: req.body.title || media.title,
        alt_text: req.body.alt_text || media.alt_text,
        caption: req.body.caption || media.caption,
        description: req.body.description || media.description,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : media.tags,
        updated_at: Date.now()
    };

    // Update media
    const updatedMedia = await Media.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true, runValidators: true }
    ).populate('upload_by', 'name email');

    res.status(200).json({
        status: 'success',
        data: updatedMedia
    });
});

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
const deleteMedia = asyncHandler(async (req, res) => {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid media ID');
    }

    // Find media
    const media = await Media.findOne({
        _id: req.params.id,
        company_id: req.user.company_id
    });

    if (!media) {
        res.status(404);
        throw new Error('Media not found');
    }

    // Extract key from file_url
    // URL format: https://bucket-name.s3.region.amazonaws.com/media/company_id/filename
    const urlParts = media.file_url.split('/');
    const key = urlParts.slice(3).join('/');

    try {
        // Delete from S3
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        });

        await s3Client.send(command);
        
        // Delete from database
        await Media.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500);
        throw new Error(`Error deleting file: ${error.message}`);
    }
});

// @desc    Generate a signed URL for direct upload to S3
// @route   GET /api/media/signed-url
// @access  Private
const getSignedUploadUrl = asyncHandler(async (req, res) => {
    const fileName = req.query.fileName;
    const contentType = req.query.contentType;
    
    if (!fileName || !contentType) {
        res.status(400);
        throw new Error('fileName and contentType are required');
    }

    const fileExtension = path.extname(fileName);
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    const key = `media/${req.user.company_id}/${uniqueFileName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
            ACL: 'public-read'
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.status(200).json({
            status: 'success',
            data: {
                signedUrl,
                fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
                key
            }
        });
    } catch (error) {
        console.error('Signed URL Error:', error);
        res.status(500);
        throw new Error(`Error generating signed URL: ${error.message}`);
    }
});

// @desc    Create media record after direct upload to S3
// @route   POST /api/media/complete-upload
// @access  Private
const completeDirectUpload = asyncHandler(async (req, res) => {
    const { key, fileUrl, title, fileSize, mimeType, altText, caption, description, tags } = req.body;

    if (!key || !fileUrl || !title || !fileSize || !mimeType) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    // Determine media type
    const mediaType = getMediaType(mimeType);

    // For images, try to get dimensions from S3
    let dimensions = null;
    if (mediaType === 'image') {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key
            });
            
            const response = await s3Client.send(command);
            const chunks = [];
            
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            
            const buffer = Buffer.concat(chunks);
            dimensions = await getImageDimensions(buffer);
        } catch (error) {
            console.error('Error getting dimensions from S3:', error);
        }
    }

    // Create media record
    const media = await Media.create({
        company_id: req.user.company_id,
        title,
        file_url: fileUrl,
        mime_type: mimeType,
        file_size: fileSize,
        alt_text: altText || '',
        caption: caption || '',
        description: description || '',
        upload_by: req.user._id,
        dimensions,
        media_type: mediaType,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    res.status(201).json({
        status: 'success',
        data: media
    });
});

module.exports = {
    uploadMedia,
    getMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    getSignedUploadUrl,
    completeDirectUpload
}; 