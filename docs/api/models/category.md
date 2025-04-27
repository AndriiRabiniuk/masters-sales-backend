# Category Model

The Category model represents content categories in the CMS, which can be organized in a hierarchical structure.

## Schema

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `_id` | String | Unique identifier for the category | Generated automatically |
| `name` | String | Name of the category | Yes |
| `slug` | String | URL-friendly version of the name | Generated automatically from name |
| `description` | String | Description of the category | No |
| `parent_id` | ObjectId | Reference to the parent category | No (null for root categories) |
| `order` | Number | Order for display in category lists | Default: 0 |
| `meta_title` | String | Custom title for SEO | No |
| `meta_description` | String | Custom description for SEO | No |
| `created_at` | Date | Date when category was created | Generated automatically |
| `updated_at` | Date | Date when category was last updated | Generated automatically |

## Relationships

| Relationship | Target Model | Description |
|--------------|--------------|-------------|
| `parent_id` | Category | The parent category (if any) |
| `children` | Category[] | Child categories (available in responses, not stored directly) |
| `content` | [Content](content.md)[] | Content items in this category |

## Example JSON

### Basic Category

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Web Development",
  "slug": "web-development",
  "description": "Articles about web development technologies and practices.",
  "parent_id": null,
  "order": 1,
  "meta_title": "Web Development Articles and Tutorials",
  "meta_description": "Learn about web development technologies, frameworks, and best practices with our comprehensive guides and tutorials.",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z"
}
```

### Category with Children

When retrieving a category with the `include_children=true` parameter, the response includes child categories:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Web Development",
  "slug": "web-development",
  "description": "Articles about web development technologies and practices.",
  "parent_id": null,
  "order": 1,
  "meta_title": "Web Development Articles and Tutorials",
  "meta_description": "Learn about web development technologies, frameworks, and best practices with our comprehensive guides and tutorials.",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "children": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "JavaScript",
      "slug": "javascript",
      "description": "Articles about JavaScript programming language.",
      "parent_id": "60d21b4667d0d8992e610c85",
      "order": 1,
      "created_at": "2022-12-01T10:00:00.000Z",
      "updated_at": "2023-01-15T11:50:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "CSS",
      "slug": "css",
      "description": "Articles about CSS styling.",
      "parent_id": "60d21b4667d0d8992e610c85",
      "order": 2,
      "created_at": "2022-12-01T10:15:00.000Z",
      "updated_at": "2023-01-15T11:55:00.000Z"
    }
  ]
}
```

### Child Category

```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "JavaScript",
  "slug": "javascript",
  "description": "Articles about JavaScript programming language.",
  "parent_id": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Web Development",
    "slug": "web-development"
  },
  "order": 1,
  "meta_title": "JavaScript Tutorials and Guides",
  "meta_description": "Learn JavaScript with our comprehensive tutorials and guides covering basics to advanced concepts.",
  "created_at": "2022-12-01T10:00:00.000Z",
  "updated_at": "2023-01-15T11:50:00.000Z"
}
```

## Notes

- Categories can be organized in a hierarchical structure using the `parent_id` field.
- Root categories have `parent_id` set to `null`.
- When retrieving a category, you can include its child categories by adding the `include_children=true` query parameter.
- When retrieving a child category, the `parent_id` field contains the parent category object with basic information.
- The `order` field determines the display order of categories in the same level of the hierarchy.
- The `slug` field is automatically generated from the `name` but can be manually modified.
- Categories are used to organize content and can be used for navigation and filtering.
- When a category is deleted, its child categories are not automatically deleted and must be handled separately.
- Content items associated with a category are not automatically deleted when the category is deleted. 