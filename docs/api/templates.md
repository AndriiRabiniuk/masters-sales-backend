# Templates API

The Templates API allows you to manage content templates in the CMS.

## Models

### Template Object

```json
{
  "_id": "60d21b4667d0d8992e610c90",
  "company_id": "60d21b4667d0d8992e610c80",
  "name": "Blog Post Template",
  "slug": "blog-post-template",
  "description": "Standard template for blog posts with responsive layout and optimized for readability.",
  "html_structure": "<article class='blog-post'>\n  <header>\n    <h1>{{title}}</h1>\n    <div class='meta'>\n      <span class='date'>{{publish_date}}</span>\n      <span class='author'>By {{author}}</span>\n    </div>\n    <img src='{{featured_image}}' alt='{{title}}' class='featured-image'>\n  </header>\n  <div class='content'>\n    {{content}}\n  </div>\n  <footer>\n    <div class='tags'>{{tags}}</div>\n    <div class='share'>{{share_buttons}}</div>\n  </footer>\n</article>",
  "css_styles": "article.blog-post {\n  max-width: 800px;\n  margin: 0 auto;\n  font-family: 'Georgia', serif;\n  line-height: 1.6;\n}\n\narticle.blog-post h1 {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.meta {\n  color: #666;\n  margin-bottom: 1.5rem;\n  font-size: 0.9rem;\n}\n\n.featured-image {\n  width: 100%;\n  height: auto;\n  margin-bottom: 2rem;\n}\n\n.content {\n  font-size: 1.1rem;\n}\n\nfooter {\n  margin-top: 2rem;\n  padding-top: 1rem;\n  border-top: 1px solid #eee;\n}",
  "js_scripts": "document.addEventListener('DOMContentLoaded', function() {\n  console.log('Blog post template loaded');\n  \n  // Format dates\n  const dates = document.querySelectorAll('.date');\n  dates.forEach(date => {\n    const d = new Date(date.textContent);\n    date.textContent = d.toLocaleDateString('en-US', {\n      year: 'numeric',\n      month: 'long',\n      day: 'numeric'\n    });\n  });\n  \n  // Initialize share buttons\n  initShareButtons();\n});\n\nfunction initShareButtons() {\n  // Implementation would go here\n  console.log('Share buttons initialized');\n}",
  "template_type": "post",
  "is_default": true,
  "preview_image": {
    "_id": "60d21b4667d0d8992e610c99",
    "file_url": "https://example.com/images/blog-template-preview.jpg"
  },
  "created_by": {
    "_id": "60d21b4667d0d8992e610c81",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "created_at": "2023-06-10T08:15:30Z",
  "updated_at": "2023-06-15T10:00:00Z"
}
```

## Template Variables

Templates support the following variables that will be replaced with actual content:

| Variable | Description |
|----------|-------------|
| `{{title}}` | The title of the content |
| `{{content}}` | The main body content |
| `{{excerpt}}` | Short summary of the content |
| `{{author}}` | Author's name |
| `{{author_id}}` | Author's ID |
| `{{category}}` | Category name |
| `{{publish_date}}` | Publication date |
| `{{featured_image}}` | URL to the featured image |
| `{{tags}}` | List of tags |
| `{{share_buttons}}` | Social media sharing buttons |
| `{{related_posts}}` | Related content items |
| `{{comments}}` | Comments section |

## Endpoints

### Get All Templates

Retrieves a list of all templates.

```
GET /api/cms/templates
```

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Template object 1
    },
    {
      // Template object 2
    }
  ]
}
```

### Get Template by ID

Retrieves a specific template by its ID.

```
GET /api/cms/templates/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Template ID |

#### Response

```json
{
  "status": "success",
  "data": {
    // Template object
  }
}
```

### Create Template

Creates a new template.

```
POST /api/cms/templates
```

#### Request Body

```json
{
  "name": "Blog Post Template",
  "description": "Standard template for blog posts with responsive layout and optimized for readability.",
  "html_structure": "<article class='blog-post'>\n  <header>\n    <h1>{{title}}</h1>\n    <div class='meta'>\n      <span class='date'>{{publish_date}}</span>\n      <span class='author'>By {{author}}</span>\n    </div>\n    <img src='{{featured_image}}' alt='{{title}}' class='featured-image'>\n  </header>\n  <div class='content'>\n    {{content}}\n  </div>\n  <footer>\n    <div class='tags'>{{tags}}</div>\n    <div class='share'>{{share_buttons}}</div>\n  </footer>\n</article>",
  "css_styles": "article.blog-post {\n  max-width: 800px;\n  margin: 0 auto;\n  font-family: 'Georgia', serif;\n  line-height: 1.6;\n}\n\narticle.blog-post h1 {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.meta {\n  color: #666;\n  margin-bottom: 1.5rem;\n  font-size: 0.9rem;\n}\n\n.featured-image {\n  width: 100%;\n  height: auto;\n  margin-bottom: 2rem;\n}\n\n.content {\n  font-size: 1.1rem;\n}\n\nfooter {\n  margin-top: 2rem;\n  padding-top: 1rem;\n  border-top: 1px solid #eee;\n}",
  "js_scripts": "document.addEventListener('DOMContentLoaded', function() {\n  console.log('Blog post template loaded');\n  \n  // Format dates\n  const dates = document.querySelectorAll('.date');\n  dates.forEach(date => {\n    const d = new Date(date.textContent);\n    date.textContent = d.toLocaleDateString('en-US', {\n      year: 'numeric',\n      month: 'long',\n      day: 'numeric'\n    });\n  });\n  \n  // Initialize share buttons\n  initShareButtons();\n});\n\nfunction initShareButtons() {\n  // Implementation would go here\n  console.log('Share buttons initialized');\n}",
  "template_type": "post",
  "is_default": true,
  "preview_image": "60d21b4667d0d8992e610c99",
  "slug": "blog-post-template" // Optional - will be auto-generated from name if not provided
}
```

#### Required Fields

- `name` - Name of the template
- `html_structure` - HTML content of the template
- `template_type` - Type of the template

#### Response

```json
{
  "status": "success",
  "data": {
    // Created template object
  }
}
```

### Update Template

Updates an existing template.

```
PUT /api/cms/templates/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Template ID to update |

#### Request Body

```json
{
  "name": "Updated Blog Post Template",
  "description": "Improved template for blog posts with better styling, dark mode support, and improved mobile responsiveness.",
  "html_structure": "<article class='blog-post'>\n  <header>\n    <h1>{{title}}</h1>\n    <div class='meta'>\n      <span class='date'>{{publish_date}}</span>\n      <span class='author'>By {{author}}</span>\n      <span class='category'>{{category}}</span>\n    </div>\n    <img src='{{featured_image}}' alt='{{title}}' class='featured-image'>\n  </header>\n  <div class='content'>\n    {{content}}\n  </div>\n  <footer>\n    <div class='tags'>{{tags}}</div>\n    <div class='related'>{{related_posts}}</div>\n    <div class='share'>{{share_buttons}}</div>\n    <div class='comments'>{{comments}}</div>\n  </footer>\n</article>",
  "css_styles": "article.blog-post {\n  max-width: 800px;\n  margin: 0 auto;\n  font-family: 'Georgia', serif;\n  line-height: 1.6;\n  padding: 20px;\n}\n\n@media (prefers-color-scheme: dark) {\n  article.blog-post {\n    background: #222;\n    color: #eee;\n  }\n}\n\n@media (max-width: 768px) {\n  article.blog-post {\n    padding: 10px;\n  }\n}\n\narticle.blog-post h1 {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.meta {\n  color: #666;\n  margin-bottom: 1.5rem;\n  font-size: 0.9rem;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n\n.featured-image {\n  width: 100%;\n  height: auto;\n  margin-bottom: 2rem;\n  border-radius: 8px;\n}\n\n.content {\n  font-size: 1.1rem;\n}\n\nfooter {\n  margin-top: 2rem;\n  padding-top: 1rem;\n  border-top: 1px solid #eee;\n}",
  "js_scripts": "document.addEventListener('DOMContentLoaded', function() {\n  console.log('Updated blog post template loaded');\n  \n  // Format dates\n  const dates = document.querySelectorAll('.date');\n  dates.forEach(date => {\n    const d = new Date(date.textContent);\n    date.textContent = d.toLocaleDateString('en-US', {\n      year: 'numeric',\n      month: 'long',\n      day: 'numeric'\n    });\n  });\n  \n  // Initialize share buttons with enhanced features\n  initShareButtons();\n  \n  // Add lazy loading to images\n  const images = document.querySelectorAll('img');\n  images.forEach(img => {\n    img.loading = 'lazy';\n  });\n  \n  // Initialize comments\n  initComments();\n});\n\nfunction initShareButtons() {\n  // Implementation would go here\n  console.log('Enhanced share buttons initialized');\n}\n\nfunction initComments() {\n  // Implementation would go here\n  console.log('Comments initialized');\n}",
  "template_type": "post",
  "is_default": true,
  "preview_image": "60d21b4667d0d8992e610c99",
  "slug": "updated-blog-post-template" // Optional - you can customize the slug
}
```

You only need to include the fields you want to update.

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated template object
  }
}
```

### Delete Template

Deletes a specific template.

```
DELETE /api/cms/templates/{id}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Template ID to delete |

#### Response

Status Code: 204 (No Content)

### Get Templates by Type

Retrieves templates filtered by type.

```
GET /api/cms/templates/type/{type}
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| type | string | path | Template type to filter by (page, post, product, landing_page, custom) |

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Template object 1
    },
    {
      // Template object 2
    }
  ]
}
```

### Get Default Templates

Retrieves templates marked as default.

```
GET /api/cms/templates/default/all
```

#### Response

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      // Template object 1
    },
    {
      // Template object 2
    }
  ]
}
```

### Set Template as Default

Marks a template as default for its type.

```
PUT /api/cms/templates/{id}/set-default
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Template ID |

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated template object with is_default: true
  }
}
```

### Remove Default Status

Removes the default status from a template.

```
PUT /api/cms/templates/{id}/remove-default
```

#### Parameters

| Name | Type | In | Description |
|------|------|------|-------------|
| id | string | path | Template ID |

#### Response

```json
{
  "status": "success",
  "data": {
    // Updated template object with is_default: false
  }
}
``` 