const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const asyncHandler = require('express-async-handler');

// Initialize S3 client with detailed logging
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// @desc    Test AWS S3 credentials by uploading a test file
// @route   POST /api/upload/test
// @access  Private
const testS3Credentials = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No file uploaded');
        }

        const file = req.file;
        const key = `test-${Date.now()}-${file.originalname}`;

        console.log('Attempting to upload to S3 with following configuration:');
        console.log('Region:', process.env.AWS_REGION);
        console.log('Bucket:', process.env.AWS_BUCKET_NAME);
        console.log('Key:', key);
        console.log('File size:', file.size);
        console.log('File type:', file.mimetype);

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read' // Make the object publicly readable
        });

        try {
            await s3Client.send(command);
            console.log('File uploaded successfully to S3');

            res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
            });
        } catch (s3Error) {
            console.error('S3 Error Details:', {
                name: s3Error.name,
                message: s3Error.message,
                code: s3Error.code,
                statusCode: s3Error.$metadata?.httpStatusCode,
                region: process.env.AWS_REGION,
                bucket: process.env.AWS_BUCKET_NAME
            });
            throw s3Error;
        }
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500);
        throw new Error(`Error uploading file: ${error.message}`);
    }
});

module.exports = {
    testS3Credentials
}; 