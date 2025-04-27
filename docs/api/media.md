# Media API

The Media API allows you to upload, manage, and retrieve media files such as images, documents, videos, and audio. All media files are stored in Amazon S3 with metadata stored in the database.

## Media Object

For a detailed description of the Media object model, see the [Media Model](models/media.md) documentation.

## Endpoints

### Upload Media

```
POST /api/media
```

Uploads a file to S3 and creates a media record in the database.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Description | Required |
|------|------|-------------|----------|
| file | File | File to upload (max 10MB) | Yes |
| title | String | Title for the media | No (defaults to filename) |
| alt_text | String | Alternative text for images | No |
| caption | String | Caption for the media | No |
| description | String | Description of the media | No |
| tags | String | Comma-separated list of tags | No |

#### Success Response

**Code:** 201 Created

**Response Body:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
    "title": "Product Image",
    "file_url": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
    "mime_type": "image/jpeg",
    "file_size": 1234567,
    "alt_text": "Red product on white background",
    "caption": "Product XYZ front view",
    "description": "High-resolution image of the product from the front angle",
    "upload_by": {
      "_id": "60d21b4667d0d8992e610c70",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dimensions": {
      "width": 1200,
      "height": 800
    },
    "media_type": "image",
    "tags": ["product", "promotional", "featured"],
    "created_at": "2023-05-10T09:30:00.000Z",
    "updated_at": "2023-05-10T09:30:00.000Z"
  }
}
```

#### Error Responses

**Code:** 400 Bad Request

```json
{
  "status": "error",
  "message": "No file uploaded"
}
```

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 500 Server Error

```json
{
  "status": "error",
  "message": "Error uploading file: [error details]"
}
```

### Get All Media

```
GET /api/media
```

Returns a paginated list of media files with optional filtering.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### Request

**Parameters:**

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| page | Number | Page number | No | 1 |
| limit | Number | Number of items per page | No | 20 |
| media_type | String | Filter by media type (`image`, `document`, `video`, `audio`) | No | |
| tags | String | Comma-separated list of tags to filter by | No | |
| search | String | Search term for title, description, alt_text, or caption | No | |

#### Success Response

**Code:** 200 OK

**Response Body:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 1,
    "limit": 20
  },
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Product Image",
      "file_url": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
      "mime_type": "image/jpeg",
      "file_size": 1234567,
      "media_type": "image",
      "dimensions": {
        "width": 1200,
        "height": 800
      },
      "upload_by": {
        "_id": "60d21b4667d0d8992e610c70",
        "name": "John Doe"
      },
      "created_at": "2023-05-10T09:30:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "title": "Product Brochure",
      "file_url": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134299-fghij.pdf",
      "mime_type": "application/pdf",
      "file_size": 2345678,
      "media_type": "document",
      "upload_by": {
        "_id": "60d21b4667d0d8992e610c70",
        "name": "John Doe"
      },
      "created_at": "2023-05-10T09:31:00.000Z"
    }
  ]
}
```

#### Error Responses

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 500 Server Error

```json
{
  "status": "error",
  "message": "Server error"
}
```

### Get Media by ID

```
GET /api/media/:id
```

Returns detailed information about a specific media item.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### URL Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| id | String | ID of the media item | Yes |

#### Success Response

**Code:** 200 OK

**Response Body:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
    "title": "Product Image",
    "file_url": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
    "mime_type": "image/jpeg",
    "file_size": 1234567,
    "alt_text": "Red product on white background",
    "caption": "Product XYZ front view",
    "description": "High-resolution image of the product from the front angle",
    "upload_by": {
      "_id": "60d21b4667d0d8992e610c70",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dimensions": {
      "width": 1200,
      "height": 800
    },
    "media_type": "image",
    "tags": ["product", "promotional", "featured"],
    "created_at": "2023-05-10T09:30:00.000Z",
    "updated_at": "2023-05-10T09:30:00.000Z"
  }
}
```

#### Error Responses

**Code:** 400 Bad Request

```json
{
  "status": "error",
  "message": "Invalid media ID"
}
```

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 404 Not Found

```json
{
  "status": "error",
  "message": "Media not found"
}
```

### Update Media

```
PUT /api/media/:id
```

Updates metadata for an existing media item.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### URL Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| id | String | ID of the media item | Yes |

#### Request

**Content-Type:** `application/json`

**Body:**

```json
{
  "title": "Updated Product Image",
  "alt_text": "Updated alt text",
  "caption": "Updated caption",
  "description": "Updated description",
  "tags": "product,featured,updated"
}
```

| Name | Type | Description | Required |
|------|------|-------------|----------|
| title | String | New title | No |
| alt_text | String | New alternative text | No |
| caption | String | New caption | No |
| description | String | New description | No |
| tags | String | Comma-separated list of tags | No |

#### Success Response

**Code:** 200 OK

**Response Body:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
    "title": "Updated Product Image",
    "file_url": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
    "mime_type": "image/jpeg",
    "file_size": 1234567,
    "alt_text": "Updated alt text",
    "caption": "Updated caption",
    "description": "Updated description",
    "upload_by": {
      "_id": "60d21b4667d0d8992e610c70",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dimensions": {
      "width": 1200,
      "height": 800
    },
    "media_type": "image",
    "tags": ["product", "featured", "updated"],
    "created_at": "2023-05-10T09:30:00.000Z",
    "updated_at": "2023-05-10T10:15:00.000Z"
  }
}
```

#### Error Responses

**Code:** 400 Bad Request

```json
{
  "status": "error",
  "message": "Invalid media ID"
}
```

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 404 Not Found

```json
{
  "status": "error",
  "message": "Media not found"
}
```

### Delete Media

```
DELETE /api/media/:id
```

Deletes a media item from S3 and removes its record from the database.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### URL Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| id | String | ID of the media item | Yes |

#### Success Response

**Code:** 200 OK

**Response Body:**

```json
{
  "status": "success",
  "message": "Media deleted successfully"
}
```

#### Error Responses

**Code:** 400 Bad Request

```json
{
  "status": "error",
  "message": "Invalid media ID"
}
```

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 404 Not Found

```json
{
  "status": "error",
  "message": "Media not found"
}
```

**Code:** 500 Server Error

```json
{
  "status": "error",
  "message": "Error deleting file: [error details]"
}
```

### Get Signed Upload URL

```
GET /api/media/signed-url
```

Generates a pre-signed URL for direct client-to-S3 upload.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### Request

**Parameters:**

| Name | Type | Description | Required |
|------|------|-------------|----------|
| fileName | String | Original filename | Yes |
| contentType | String | MIME type of the file | Yes |

#### Success Response

**Code:** 200 OK

**Response Body:**

```json
{
  "status": "success",
  "data": {
    "signedUrl": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
    "fileUrl": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
    "key": "media/company_id/1624134214-abcde.jpg"
  }
}
```

#### Error Responses

**Code:** 400 Bad Request

```json
{
  "status": "error",
  "message": "fileName and contentType are required"
}
```

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 500 Server Error

```json
{
  "status": "error",
  "message": "Error generating signed URL: [error details]"
}
```

### Complete Direct Upload

```
POST /api/media/complete-upload
```

Creates a media record after successful direct upload to S3.

#### Authentication

Requires a valid JWT token with appropriate permissions.

#### Request

**Content-Type:** `application/json`

**Body:**

```json
{
  "key": "media/company_id/1624134214-abcde.jpg",
  "fileUrl": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
  "title": "Product Image",
  "fileSize": 1234567,
  "mimeType": "image/jpeg",
  "altText": "Red product on white background",
  "caption": "Product XYZ front view",
  "description": "High-resolution image of the product from the front angle",
  "tags": "product,promotional,featured"
}
```

| Name | Type | Description | Required |
|------|------|-------------|----------|
| key | String | S3 key of the uploaded file | Yes |
| fileUrl | String | Full URL to the uploaded file | Yes |
| title | String | Title for the media | Yes |
| fileSize | Number | Size of the file in bytes | Yes |
| mimeType | String | MIME type of the file | Yes |
| altText | String | Alternative text for the media | No |
| caption | String | Caption for the media | No |
| description | String | Description of the media | No |
| tags | String | Comma-separated list of tags | No |

#### Success Response

**Code:** 201 Created

**Response Body:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
    "title": "Product Image",
    "file_url": "https://bucket-name.s3.region.amazonaws.com/media/company_id/1624134214-abcde.jpg",
    "mime_type": "image/jpeg",
    "file_size": 1234567,
    "alt_text": "Red product on white background",
    "caption": "Product XYZ front view",
    "description": "High-resolution image of the product from the front angle",
    "upload_by": {
      "_id": "60d21b4667d0d8992e610c70",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dimensions": {
      "width": 1200,
      "height": 800
    },
    "media_type": "image",
    "tags": ["product", "promotional", "featured"],
    "created_at": "2023-05-10T09:30:00.000Z",
    "updated_at": "2023-05-10T09:30:00.000Z"
  }
}
```

#### Error Responses

**Code:** 400 Bad Request

```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**Code:** 401 Unauthorized

```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**Code:** 500 Server Error

```json
{
  "status": "error",
  "message": "Server error"
}
```

## Usage Examples

### Basic File Upload

```javascript
// HTML form
// <form id="uploadForm">
//   <input type="file" name="file" id="fileInput">
//   <input type="text" name="title" placeholder="Title">
//   <input type="text" name="alt_text" placeholder="Alt Text">
//   <button type="submit">Upload</button>
// </form>

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const fileInput = document.getElementById('fileInput');
  
  if (!fileInput.files.length) {
    alert('Please select a file');
    return;
  }
  
  try {
    const response = await fetch('/api/media', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Upload successful:', result);
      // Do something with the uploaded media
    } else {
      console.error('Upload failed:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
```

### Direct S3 Upload (For Large Files)

```javascript
async function uploadLargeFile(file, metadata) {
  try {
    // Step 1: Get a signed URL
    const params = new URLSearchParams({
      fileName: file.name,
      contentType: file.type
    });
    
    const signedUrlResponse = await fetch(`/api/media/signed-url?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!signedUrlResponse.ok) {
      throw new Error('Failed to get signed URL');
    }
    
    const { data } = await signedUrlResponse.json();
    
    // Step 2: Upload directly to S3
    const uploadResponse = await fetch(data.signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to S3');
    }
    
    // Step 3: Complete the upload
    const completeResponse = await fetch('/api/media/complete-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        key: data.key,
        fileUrl: data.fileUrl,
        title: metadata.title || file.name,
        fileSize: file.size,
        mimeType: file.type,
        altText: metadata.altText,
        caption: metadata.caption,
        description: metadata.description,
        tags: metadata.tags
      })
    });
    
    if (!completeResponse.ok) {
      throw new Error('Failed to complete upload');
    }
    
    return await completeResponse.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Usage
uploadLargeFile(fileObject, {
  title: 'Large Video File',
  altText: 'Product demonstration video',
  description: 'Detailed demonstration of product features',
  tags: 'video,product,demo'
})
  .then(result => console.log('Upload complete:', result))
  .catch(error => console.error('Upload failed:', error));
```

### Retrieving Media with Filtering

```javascript
async function getMediaLibrary(options = {}) {
  const params = new URLSearchParams();
  
  if (options.page) params.append('page', options.page);
  if (options.limit) params.append('limit', options.limit);
  if (options.mediaType) params.append('media_type', options.mediaType);
  if (options.tags) params.append('tags', options.tags);
  if (options.search) params.append('search', options.search);
  
  try {
    const response = await fetch(`/api/media?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch media');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
}

// Usage examples:
// Get all images
getMediaLibrary({ mediaType: 'image' })
  .then(result => console.log('Images:', result.data));

// Search for product-related media
getMediaLibrary({ search: 'product', limit: 50 })
  .then(result => console.log('Product media:', result.data));

// Get media with specific tags
getMediaLibrary({ tags: 'featured,homepage' })
  .then(result => console.log('Featured media:', result.data));
```

## Best Practices

1. **Optimize Before Upload**: Compress and resize images on the client side before uploading to reduce bandwidth usage and storage costs.

2. **Use Appropriate MIME Types**: Always specify the correct content type when uploading files.

3. **Add Descriptive Metadata**: Include meaningful titles, descriptions, and alt text to make media more searchable and accessible.

4. **Use Tags Consistently**: Establish a consistent tagging system to organize your media library.

5. **Use Direct S3 Upload for Large Files**: For files larger than 5MB, use the signed URL method to upload directly to S3.

6. **Implement Client-Side Validation**: Validate file types, sizes, and dimensions on the client side before uploading.

7. **Handle Errors Gracefully**: Implement proper error handling for upload failures and provide clear feedback to users.

## Security Considerations

1. **Authentication**: All API endpoints require authentication via JWT tokens.

2. **Company Isolation**: Media items are isolated by company_id, ensuring users can only access media from their own company.

3. **File Type Validation**: Implement client-side validation of file types before uploading.

4. **Content Security**: Set appropriate Content-Security-Policy headers to prevent unauthorized access to media files.

5. **URL Signing**: S3 URLs can be signed with expiration times for sensitive media that shouldn't be publicly accessible. 