# Media Model

The Media model represents files such as images, documents, videos, and audio files stored in the CMS system. Media files are stored in Amazon S3 with metadata and references maintained in the database.

## Schema

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `_id` | String | Unique identifier for the media item | Generated automatically |
| `company_id` | ObjectId | Reference to the company that owns this media | Yes |
| `title` | String | Title/name of the media file | Yes |
| `file_url` | String | URL to the file in S3 storage | Yes |
| `mime_type` | String | MIME type of the file (e.g., 'image/jpeg', 'application/pdf') | Yes |
| `file_size` | Number | Size of the file in bytes | Yes |
| `alt_text` | String | Alternative text for images (accessibility) | No |
| `caption` | String | Caption describing the media | No |
| `description` | String | Detailed description of the media | No |
| `upload_by` | ObjectId | Reference to the user who uploaded the file | Yes |
| `dimensions` | Object | Width and height for images | No |
| `media_type` | String | Type of media: 'image', 'document', 'video', 'audio' | Yes |
| `tags` | Array | Array of tag strings for categorization | No |
| `created_at` | Date | Date when the media was uploaded | Generated automatically |
| `updated_at` | Date | Date when the media was last updated | Generated automatically |

## Dimensions Object (for images)

| Field | Type | Description |
|-------|------|-------------|
| `width` | Number | Width of the image in pixels |
| `height` | Number | Height of the image in pixels |

## Media Types

| Type | Description | Common MIME Types |
|------|-------------|------------------|
| `image` | Image files | image/jpeg, image/png, image/gif, image/webp |
| `document` | Document files | application/pdf, application/msword, text/plain |
| `video` | Video files | video/mp4, video/quicktime, video/webm |
| `audio` | Audio files | audio/mpeg, audio/wav, audio/ogg |

## Relationships

| Relationship | Target Model | Description |
|--------------|--------------|-------------|
| `upload_by` | [User](user.md) | User who uploaded the media |
| `company_id` | Company | Company that owns the media |

## API Endpoints

### Upload Media

**POST /api/media**

Uploads a file to S3 and creates a media record in the database.

#### Request

```
POST /api/media
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `file` | File | The file to upload (max 10MB) | Yes |
| `title` | String | Title for the media | No (defaults to filename) |
| `alt_text` | String | Alternative text for the media | No |
| `caption` | String | Caption for the media | No |
| `description` | String | Description of the media | No |
| `tags` | String | Comma-separated list of tags | No |

#### Response

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

### Get All Media

**GET /api/media**

Retrieves a paginated list of media files with optional filtering.

#### Request

```
GET /api/media?page=1&limit=20&media_type=image&tags=product,featured&search=product
Authorization: Bearer <token>
```

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `page` | Number | Page number (default: 1) | No |
| `limit` | Number | Number of items per page (default: 20) | No |
| `media_type` | String | Filter by media type | No |
| `tags` | String | Filter by comma-separated tags | No |
| `search` | String | Search in title, description, alt_text, caption | No |

#### Response

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

### Get Media by ID

**GET /api/media/:id**

Retrieves a single media item by ID.

#### Request

```
GET /api/media/60d21b4667d0d8992e610c85
Authorization: Bearer <token>
```

#### Response

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

### Update Media

**PUT /api/media/:id**

Updates metadata for an existing media item.

#### Request

```
PUT /api/media/60d21b4667d0d8992e610c85
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Product Image",
  "alt_text": "Updated alt text",
  "caption": "Updated caption",
  "description": "Updated description",
  "tags": "product,featured,updated"
}
```

#### Response

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

### Delete Media

**DELETE /api/media/:id**

Deletes a media item from S3 and removes its record from the database.

#### Request

```
DELETE /api/media/60d21b4667d0d8992e610c85
Authorization: Bearer <token>
```

#### Response

```json
{
  "status": "success",
  "message": "Media deleted successfully"
}
```

### Get Signed Upload URL

**GET /api/media/signed-url**

Generates a pre-signed URL for direct client-to-S3 upload.

#### Request

```
GET /api/media/signed-url?fileName=image.jpg&contentType=image/jpeg
Authorization: Bearer <token>
```

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `fileName` | String | Original filename | Yes |
| `contentType` | String | MIME type of the file | Yes |

#### Response

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

### Complete Direct Upload

**POST /api/media/complete-upload**

Creates a media record after successful direct upload to S3.

#### Request

```
POST /api/media/complete-upload
Content-Type: application/json
Authorization: Bearer <token>

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

#### Response

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

## Using Media in Content

Media items can be referenced in content items by their ID. For example, to set a featured image for a content item:

```json
{
  "title": "New Blog Post",
  "content": "<p>This is the blog content.</p>",
  "featured_image": "60d21b4667d0d8992e610c85"
}
```

## Client Integration Examples

### Uploading a File

```javascript
// Method 1: Direct upload using multipart/form-data
async function uploadMedia(file, metadata) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title || file.name);
  
  if (metadata.altText) formData.append('alt_text', metadata.altText);
  if (metadata.caption) formData.append('caption', metadata.caption);
  if (metadata.description) formData.append('description', metadata.description);
  if (metadata.tags) formData.append('tags', metadata.tags.join(','));
  
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}

// Method 2: Using signed URLs for direct S3 upload
async function uploadUsingSignedUrl(file, metadata) {
  // Step 1: Get a signed URL
  const params = new URLSearchParams({
    fileName: file.name,
    contentType: file.type
  });
  
  const signedUrlResponse = await fetch(`/api/media/signed-url?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const { data } = await signedUrlResponse.json();
  
  // Step 2: Upload directly to S3 using the signed URL
  await fetch(data.signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });
  
  // Step 3: Complete the upload process
  const completeResponse = await fetch('/api/media/complete-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
      tags: metadata.tags ? metadata.tags.join(',') : ''
    })
  });
  
  return await completeResponse.json();
}
```

### Retrieving Media

```javascript
// Get all media with pagination and filtering
async function getMedia(page = 1, filters = {}) {
  const params = new URLSearchParams({
    page,
    limit: filters.limit || 20
  });
  
  if (filters.mediaType) params.append('media_type', filters.mediaType);
  if (filters.tags) params.append('tags', filters.tags.join(','));
  if (filters.search) params.append('search', filters.search);
  
  const response = await fetch(`/api/media?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// Get a single media item
async function getMediaById(id) {
  const response = await fetch(`/api/media/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

## Best Practices

1. **Image Optimization**:
   - Resize large images before uploading to reduce storage costs and improve loading times
   - Consider using WebP format for better compression
   - Always provide meaningful alt text for accessibility

2. **File Size Limitations**:
   - The API limits uploads to 10MB per file
   - For larger files, consider using compression or breaking the content into smaller pieces

3. **Media Organization**:
   - Use meaningful titles and descriptions
   - Apply consistent tags to make media searchable
   - Group related media using common tag prefixes (e.g., "product-", "banner-")

4. **Security Considerations**:
   - All uploads pass through server-side validation
   - Direct uploads using signed URLs still require authentication
   - Always validate file types on both client and server side

5. **Performance Tips**:
   - Use the direct upload method (signed URLs) for large files
   - Consider lazy loading images in content to improve page load times
   - Use appropriate image sizes for different display contexts 