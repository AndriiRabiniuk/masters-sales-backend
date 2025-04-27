# Content Model

The Content model represents articles, pages, blog posts, and other content items in the CMS.

## Schema

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `_id` | String | Unique identifier for the content item | Generated automatically |
| `title` | String | Title of the content item | Yes |
| `slug` | String | URL-friendly version of the title | Generated automatically from title |
| `content` | String | HTML content of the content item | Yes |
| `excerpt` | String | Short summary or excerpt of the content | No |
| `author_id` | ObjectId | Reference to the user who created the content | Set automatically to current user |
| `category_id` | ObjectId | Reference to the content category | Yes |
| `template_id` | ObjectId | Reference to the template used for rendering | Yes |
| `featured_image` | ObjectId | Reference to the featured image | No |
| `status` | String | Publication status: `draft`, `published`, `archived` | Default: `draft` |
| `visibility` | String | Content visibility: `public`, `private`, `password` | Default: `public` |
| `password` | String | Password for access (when visibility is `password`) | Only required when visibility is `password` |
| `publish_date` | Date | Date when content was/will be published | Set automatically when published |
| `meta_title` | String | Custom title for SEO | No |
| `meta_description` | String | Custom description for SEO | No |
| `created_at` | Date | Date when content was created | Generated automatically |
| `updated_at` | Date | Date when content was last updated | Generated automatically |

## Relationships

| Relationship | Target Model | Description |
|--------------|--------------|-------------|
| `author_id` | [User](user.md) | The user who created the content |
| `category_id` | [Category](category.md) | The category the content belongs to |
| `template_id` | [Template](template.md) | The template used for rendering the content |
| `featured_image` | Media | The featured image for the content |
| `tags` | [Tag](tag.md) | Tags associated with the content (many-to-many) |

## Status Values

| Status | Description |
|--------|-------------|
| `draft` | Content is in draft state and not publicly visible |
| `published` | Content is published and publicly accessible |
| `archived` | Content is archived and not publicly visible |

## Visibility Values

| Visibility | Description |
|------------|-------------|
| `public` | Content is visible to all users |
| `private` | Content is only visible to authenticated users |
| `password` | Content is protected by a password |

## Example JSON

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "title": "Getting Started with React",
  "slug": "getting-started-with-react",
  "content": "<p>React is a popular JavaScript library for building user interfaces.</p><h2>Installation</h2><p>You can install React using npm...</p>",
  "excerpt": "Learn the basics of React, the popular JavaScript library for building user interfaces.",
  "author_id": {
    "_id": "60d21b4667d0d8992e610c80",
    "name": "John Doe"
  },
  "category_id": {
    "_id": "60d21b4667d0d8992e610c81",
    "name": "Web Development"
  },
  "template_id": {
    "_id": "60d21b4667d0d8992e610c82",
    "name": "Blog Post"
  },
  "featured_image": {
    "_id": "60d21b4667d0d8992e610c83",
    "file_url": "https://example.com/images/react-logo.png"
  },
  "status": "published",
  "visibility": "public",
  "publish_date": "2023-01-15T12:00:00.000Z",
  "meta_title": "Getting Started with React - Complete Beginner's Guide",
  "meta_description": "Learn the basics of React, the popular JavaScript library for building user interfaces. This guide covers installation, components, state, and more.",
  "created_at": "2023-01-10T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z"
}
```

## Notes

- When content is created, it's automatically assigned a status of `draft`.
- Content with a status of `draft` or `archived` is not included in public API responses.
- The `slug` field is automatically generated from the `title` but can be manually modified.
- When content is published, the `publish_date` is automatically set to the current date/time if not already set.
- Content can have multiple tags, which are managed through a separate endpoint.
- When retrieving content via the API, related models are typically included in the response. 