# Template Model

The Template model represents content templates in the CMS, which define the structure and styling for rendering content items.

## Schema

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `_id` | String | Unique identifier for the template | Generated automatically |
| `name` | String | Name of the template | Yes |
| `description` | String | Description of the template | No |
| `html_structure` | String | HTML structure of the template with placeholders | Yes |
| `css_styles` | String | CSS styles for the template | No |
| `js_scripts` | String | JavaScript code for the template | No |
| `fields` | Array | Custom fields configuration | No |
| `created_at` | Date | Date when template was created | Generated automatically |
| `updated_at` | Date | Date when template was last updated | Generated automatically |

## Fields Object Structure

The `fields` array contains objects that define custom fields for the template:

```json
{
  "name": "sidebar_content",
  "label": "Sidebar Content",
  "type": "html",
  "required": false,
  "default": "<p>Default sidebar content</p>",
  "description": "Content to display in the sidebar"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Field name (used in the template) |
| `label` | String | Display label for the field |
| `type` | String | Field type (text, html, image, etc.) |
| `required` | Boolean | Whether the field is required |
| `default` | Any | Default value for the field |
| `description` | String | Description of the field |

## Relationships

| Relationship | Target Model | Description |
|--------------|--------------|-------------|
| `content` | [Content](content.md)[] | Content items using this template |

## Example JSON

### Basic Template

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Blog Post",
  "description": "Standard blog post template with featured image and sidebar",
  "html_structure": "<article class=\"blog-post\">\n  <header>\n    <h1>{{title}}</h1>\n    <div class=\"meta\">\n      <span class=\"author\">By {{author}}</span>\n      <span class=\"date\">{{publish_date}}</span>\n      <span class=\"category\">{{category}}</span>\n    </div>\n    {{#if featured_image}}\n    <div class=\"featured-image\">\n      <img src=\"{{featured_image}}\" alt=\"{{title}}\">\n    </div>\n    {{/if}}\n  </header>\n  <div class=\"content\">\n    {{content}}\n  </div>\n  <div class=\"sidebar\">\n    {{sidebar_content}}\n  </div>\n  <footer>\n    <div class=\"tags\">{{tags}}</div>\n  </footer>\n</article>",
  "css_styles": ".blog-post {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.blog-post header {\n  margin-bottom: 20px;\n}\n\n.blog-post .meta {\n  color: #666;\n  margin-bottom: 10px;\n}\n\n.blog-post .featured-image img {\n  max-width: 100%;\n  height: auto;\n}\n\n.blog-post .content {\n  line-height: 1.6;\n}\n\n.blog-post .sidebar {\n  background: #f5f5f5;\n  padding: 15px;\n  margin-top: 20px;\n}\n\n.blog-post footer {\n  margin-top: 30px;\n  border-top: 1px solid #eee;\n  padding-top: 15px;\n}\n\n.blog-post .tags span {\n  display: inline-block;\n  background: #eee;\n  padding: 3px 8px;\n  margin-right: 5px;\n  border-radius: 3px;\n}",
  "js_scripts": "document.addEventListener('DOMContentLoaded', function() {\n  const blogPost = document.querySelector('.blog-post');\n  \n  // Add lightbox to images\n  const images = blogPost.querySelectorAll('.content img');\n  images.forEach(img => {\n    img.addEventListener('click', function() {\n      // Lightbox code here\n    });\n  });\n});",
  "fields": [
    {
      "name": "sidebar_content",
      "label": "Sidebar Content",
      "type": "html",
      "required": false,
      "default": "<p>Default sidebar content</p>",
      "description": "Content to display in the sidebar"
    }
  ],
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z"
}
```

### Template with Content Count

When retrieving templates with the `include_count=true` parameter, the response includes a count of associated content items:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Blog Post",
  "description": "Standard blog post template with featured image and sidebar",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "count": 32
}
```

## Notes

- Templates define the structure and presentation of content items.
- Templates can include custom fields that extend the standard content model.
- The `html_structure` field uses placeholders in the format `{{field_name}}` which are replaced with actual content when rendering.
- Common placeholders include: `{{title}}`, `{{content}}`, `{{excerpt}}`, `{{author}}`, `{{publish_date}}`, `{{featured_image}}`, `{{category}}`, and `{{tags}}`.
- Conditional sections can be defined using Handlebars-style syntax: `{{#if field_name}}...{{/if}}`.
- Templates can include CSS styles that will be applied when rendering content with the template.
- Templates can include JavaScript code that will be executed when rendering content with the template.
- When a template is updated, it affects all content items using that template.
- When retrieving templates, you can include a count of associated content items by adding the `include_count=true` query parameter.
- The API provides endpoints for retrieving templates by name or ID.
- When creating content, a template must be specified.
- Templates enable consistent presentation of content across the site. 