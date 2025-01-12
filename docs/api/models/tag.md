# Tag Model

The Tag model represents content tags in the CMS, which are used to categorize and filter content items.

## Schema

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `_id` | String | Unique identifier for the tag | Generated automatically |
| `name` | String | Name of the tag | Yes |
| `slug` | String | URL-friendly version of the name | Generated automatically from name |
| `description` | String | Description of the tag | No |
| `created_at` | Date | Date when tag was created | Generated automatically |
| `updated_at` | Date | Date when tag was last updated | Generated automatically |

## Relationships

| Relationship | Target Model | Description |
|--------------|--------------|-------------|
| `content` | [Content](content.md)[] | Content items associated with this tag (many-to-many) |

## Example JSON

### Basic Tag

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "React",
  "slug": "react",
  "description": "Articles related to React JavaScript library",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z"
}
```

### Tag with Content Count

When retrieving tags with the `include_count=true` parameter, the response includes a count of associated content items:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "React",
  "slug": "react",
  "description": "Articles related to React JavaScript library",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "count": 15
}
```

### Tag with Associated Content

When retrieving a tag with the `include_content=true` parameter, the response includes associated content items:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "React",
  "slug": "react",
  "description": "Articles related to React JavaScript library",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "content": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "title": "Getting Started with React",
      "slug": "getting-started-with-react",
      "excerpt": "Learn the basics of React, a JavaScript library for building user interfaces.",
      "status": "published",
      "publish_date": "2023-01-10T12:00:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c91",
      "title": "React Hooks Tutorial",
      "slug": "react-hooks-tutorial",
      "excerpt": "Learn how to use React Hooks to add state and other React features to functional components.",
      "status": "published",
      "publish_date": "2023-01-15T12:00:00.000Z"
    }
    // ... more content items
  ]
}
```

## Notes

- Tags have a many-to-many relationship with content items.
- The relationship is managed through a separate collection/table in the database.
- When retrieving tags, you can include a count of associated content items by adding the `include_count=true` query parameter.
- When retrieving a tag, you can include its associated content items by adding the `include_content=true` query parameter.
- The `slug` field is automatically generated from the `name` but can be manually modified.
- Tags can be used for filtering content and building tag clouds.
- When a tag is deleted, the associations with content items are also deleted, but the content items themselves are not affected.
- Tag names are unique in the system.
- The API provides endpoints for retrieving popular tags based on usage count.
- Tags can be assigned to and removed from content items through dedicated endpoints. 