# Content API

The Content API allows you to manage content items in the CMS.

## Models

### Content Object

```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "company_id": "60d21b4667d0d8992e610c80",
  "title": "10 Ways to Improve Your Website Performance",
  "slug": "10-ways-to-improve-your-website-performance",
  "content": "<p>This is the main content with <strong>formatting</strong>...</p>",
  "excerpt": "Learn how to make your website faster and more responsive",
  "author_id": {
    "_id": "60d21b4667d0d8992e610c81",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "category_id": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Web Development"
  },
  "template_id": {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Blog Post Template"
  },
  "featured_image": {
    "_id": "60d21b4667d0d8992e610c99",
    "file_url": "https://example.com/images/website-performance.jpg"
  },
  "status": "published",
  "visibility": "public",
  "password": null,
  "publish_date": "2023-06-15T10:00:00Z",
  "meta_title": "10 Ways to Improve Website Performance | Your Site Name",
  "meta_description": "Learn effective techniques to boost your website's speed and performance for better user experience and SEO rankings.",
  "created_at": "2023-06-10T08:15:30Z",
  "updated_at": "2023-06-15T10:00:00Z"
}
```

## Endpoints

### Get All Content

Retrieves a list of all content items.

```
GET /api/cms/content
```

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Content object 1
    },
    {
      // Content object 2
    }
  ]
}
```

### Get Content by ID

Retrieves a specific content item by its ID.

```
GET /api/cms/content/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Content ID |

#### Response

```json
{
  "status": "success",
  "data": {
    // Content object
  }
}
```

### Create Content

Creates a new content item.

```
POST /api/cms/content
```

#### Request Body

```json
{
  "title": "New Article Title",
  "content": "<p>This is the main content of the article with <strong>formatting</strong> and details about the topic.</p><p>This is another paragraph with more information.</p>",
  "excerpt": "A brief summary of the article content for preview displays and SEO.",
  "category_id": "60d21b4667d0d8992e610c85",
  "template_id": "60d21b4667d0d8992e610c90",
  "featured_image": "60d21b4667d0d8992e610c99",
  "status": "draft",
  "visibility": "public",
  "password": null,
  "publish_date": "2023-06-15T10:00:00Z",
  "meta_title": "SEO Title for the Article | Your Site Name",
  "meta_description": "SEO description for search engines, including keywords and a call to action, limited to around 160 characters.",
  "slug": "new-article-title" // Optional - will be auto-generated from title if not provided
}
```

#### Required Fields

- `title` - Title of the content
- `content` - Main body content 
- `category_id` - ID of the category this content belongs to
- `template_id` - ID of the template to use for this content

#### Response

```json
{
  "status": "success",
  "data": {
    // Created content object
  }
}
```

### Update Content

Updates an existing content item.

```
PUT /api/cms/content/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Content ID to update |

#### Request Body

```json
{
  "title": "Updated Article Title",
  "content": "<p>Updated content of the article with improved <strong>formatting</strong> and additional details.</p><p>This paragraph contains new information not in the original version.</p>",
  "excerpt": "Updated summary of the article content with improved keywords.",
  "category_id": "60d21b4667d0d8992e610c85",
  "template_id": "60d21b4667d0d8992e610c90",
  "featured_image": "60d21b4667d0d8992e610c99",
  "status": "published",
  "visibility": "public",
  "password": null,
  "publish_date": "2023-06-15T10:00:00Z",
  "meta_title": "Updated SEO Title | Your Site Name",
  "meta_description": "Updated SEO description with better keywords and a stronger call to action.",
  "slug": "updated-article-title" // Optional - you can customize the slug
}
```

You only need to include the fields you want to update.

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated content object
  }
}
```

### Delete Content

Deletes a specific content item.

```
DELETE /api/cms/content/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Content ID to delete |

#### Response

Status Code: 204 (No Content)

### Get Content by Status

Retrieves content items filtered by status.

```
GET /api/cms/content/status/{status}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| status | string | path | Status to filter by (draft, published, archived) |

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Content object 1
    },
    {
      // Content object 2
    }
  ]
}
```

### Get Content by Category

Retrieves content items belonging to a specific category.

```
GET /api/cms/content/category/{categoryId}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| categoryId | string | path | Category ID to filter by |

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Content object 1
    },
    {
      // Content object 2
    }
  ]
}
```

### Get Content by Slug

Retrieves a content item by its slug.

```
GET /api/cms/content/slug/{slug}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| slug | string | path | URL-friendly slug |

#### Response

```json
{
  "status": "success",
  "data": {
    // Content object
  }
}
```

### Publish Content

Changes the status of a content item to "published".

```
PUT /api/cms/content/{id}/publish
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Content ID to publish |

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated content object with status: "published"
  }
}
```

### Archive Content

Changes the status of a content item to "archived".

```
PUT /api/cms/content/{id}/archive
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Content ID to archive |

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated content object with status: "archived"
  }
}
``` 