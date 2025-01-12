# Tags API

The Tags API allows you to manage content tags in the CMS.

## Models

### Tag Object

```json
{
  "_id": "60d21b4667d0d8992e610c87",
  "company_id": "60d21b4667d0d8992e610c80",
  "name": "JavaScript",
  "slug": "javascript",
  "description": "Articles related to JavaScript programming and frameworks",
  "count": 12,
  "created_at": "2023-06-10T08:15:30Z",
  "updated_at": "2023-06-15T10:00:00Z"
}
```

## Endpoints

### Get All Tags

Retrieves a list of all tags.

```
GET /api/cms/tags
```

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Tag object 1
    },
    {
      // Tag object 2
    }
  ]
}
```

### Get Tag by ID

Retrieves a specific tag by its ID.

```
GET /api/cms/tags/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Tag ID |

#### Response

```json
{
  "status": "success",
  "data": {
    // Tag object
  }
}
```

### Create Tag

Creates a new tag.

```
POST /api/cms/tags
```

#### Request Body

```json
{
  "name": "JavaScript",
  "description": "Articles related to JavaScript programming",
  "slug": "javascript" // Optional - will be auto-generated from name if not provided
}
```

#### Required Fields

- `name` - Name of the tag

#### Response

```json
{
  "status": "success",
  "data": {
    // Created tag object
  }
}
```

### Update Tag

Updates an existing tag.

```
PUT /api/cms/tags/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Tag ID to update |

#### Request Body

```json
{
  "name": "JavaScript ES6+",
  "description": "Modern JavaScript features and best practices",
  "slug": "javascript-es6-plus" // Optional - you can customize the slug
}
```

You only need to include the fields you want to update.

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated tag object
  }
}
```

### Delete Tag

Deletes a specific tag.

```
DELETE /api/cms/tags/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Tag ID to delete |

#### Response

Status Code: 204 (No Content)

### Get Tags by Usage Count

Retrieves tags filtered by a minimum usage count.

```
GET /api/cms/tags/usage/{minCount}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| minCount | integer | path | Minimum usage count threshold |

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Tag object 1
    },
    {
      // Tag object 2
    }
  ]
}
```

### Get Tags for Content

Retrieves all tags associated with a specific content item.

```
GET /api/cms/tags/content/{contentId}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| contentId | string | path | Content ID to get associated tags |

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Tag object 1
    },
    {
      // Tag object 2
    }
  ]
}
```

### Add Tag to Content

Associates a tag with a content item.

```
POST /api/cms/tags/content/{contentId}/tag/{tagId}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| contentId | string | path | Content ID to add tag to |
| tagId | string | path | Tag ID to add to content |

#### Response

```json
{
  "status": "success",
  "data": {
    "content_id": "60d21b4667d0d8992e610c86",
    "tag_id": "60d21b4667d0d8992e610c87"
  }
}
```

### Remove Tag from Content

Removes a tag association from a content item.

```
DELETE /api/cms/tags/content/{contentId}/tag/{tagId}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| contentId | string | path | Content ID to remove tag from |
| tagId | string | path | Tag ID to remove from content |

#### Response

Status Code: 204 (No Content) 