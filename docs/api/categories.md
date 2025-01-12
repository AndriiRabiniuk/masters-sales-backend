# Categories API

The Categories API allows you to manage content categories in the CMS.

## Models

### Category Object

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "company_id": "60d21b4667d0d8992e610c80",
  "name": "Web Development",
  "slug": "web-development",
  "description": "Articles about web development, including frontend, backend, and best practices.",
  "parent_id": null,
  "featured_image": {
    "_id": "60d21b4667d0d8992e610c99",
    "file_url": "https://example.com/images/web-development.jpg"
  },
  "order": 1,
  "meta_title": "Web Development Articles | Your Site Name",
  "meta_description": "Read our latest articles about web development trends, best practices, and tutorials.",
  "created_at": "2023-06-10T08:15:30Z",
  "updated_at": "2023-06-15T10:00:00Z"
}
```

## Endpoints

### Get All Categories

Retrieves a list of all categories.

```
GET /api/cms/categories
```

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Category object 1
    },
    {
      // Category object 2
    }
  ]
}
```

### Get Category by ID

Retrieves a specific category by its ID.

```
GET /api/cms/categories/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Category ID |

#### Response

```json
{
  "status": "success",
  "data": {
    // Category object
  }
}
```

### Create Category

Creates a new category.

```
POST /api/cms/categories
```

#### Request Body

```json
{
  "name": "Technology",
  "description": "Articles about technology and innovation, including software development, AI, and hardware reviews.",
  "parent_id": null,
  "featured_image": "60d21b4667d0d8992e610c99",
  "order": 1,
  "meta_title": "Technology Articles | Your Site Name",
  "meta_description": "Read our latest articles about technology, innovation, and digital transformation to stay informed about industry trends.",
  "slug": "technology" // Optional - will be auto-generated from name if not provided
}
```

#### Required Fields

- `name` - Name of the category

#### Response

```json
{
  "status": "success",
  "data": {
    // Created category object
  }
}
```

### Update Category

Updates an existing category.

```
PUT /api/cms/categories/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Category ID to update |

#### Request Body

```json
{
  "name": "Tech & Innovation",
  "description": "Updated description for technology category covering software, hardware, AI developments, and digital transformation strategies.",
  "parent_id": "60d21b4667d0d8992e610c85", // ID of a parent category, if making this a subcategory
  "featured_image": "60d21b4667d0d8992e610c99", // Updated featured image
  "order": 2,
  "meta_title": "Technology & Innovation | Your Site Name",
  "meta_description": "Explore our updated collection of tech articles covering the latest innovations, software releases, and industry insights.",
  "slug": "tech-innovation" // Optional - you can customize the slug
}
```

You only need to include the fields you want to update.

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated category object
  }
}
```

### Delete Category

Deletes a specific category.

```
DELETE /api/cms/categories/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Category ID to delete |

#### Response

Status Code: 204 (No Content)

### Get Categories by Parent

Retrieves categories that are children of a specific parent category.

```
GET /api/cms/categories/parent/{parentId}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| parentId | string | path | Parent category ID |

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Category object 1
    },
    {
      // Category object 2
    }
  ]
}
```

### Get Root Categories

Retrieves categories that have no parent (top-level categories).

```
GET /api/cms/categories/root/all
```

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Category object 1
    },
    {
      // Category object 2
    }
  ]
}
```

### Update Category Order

Updates the display order of a category.

```
PUT /api/cms/categories/{id}/order
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Category ID |

#### Request Body

```json
{
  "order": 3
}
```

#### Required Fields

- `order` - New position order for the category

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated category object
  }
}
``` 