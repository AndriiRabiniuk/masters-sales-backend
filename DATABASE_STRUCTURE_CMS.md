# Masters Sales Backend - CMS Database Structure

## Overview

The CMS module has been integrated into the existing Masters Sales Backend to provide content management capabilities. The CMS follows the same company-centric data model, where content is associated with companies, allowing for multi-company/multi-tenant content management.

## Entity Relationship Diagram

```
┌─────────────┐                 ┌─────────────┐
│             │                 │             │
│   Company   │◄───────────────┤    User     │
│             │                 │             │
└─────┬───────┘                 └──────┬──────┘
      │                                │
      │                                │ created_by/author_id
      │ company_id                     │
      ▼                                ▼
┌─────────────┐     ┌───────┐    ┌─────────────┐
│             │     │       │    │             │
│   Content   │◄────┤Content├────┤     Tag     │
│             │     │  Tag  │    │             │
└──────┬──────┘     └───────┘    └─────────────┘
       │
       │
       │
┌──────┴──────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  Category   │     │   Media     │     │  Template   │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Data Model

### Content

Content represents pages, blog posts, articles, or any other type of content managed by the CMS.

```javascript
{
  company_id: ObjectId, // Reference to Company
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author_id: ObjectId, // Reference to User
  category_id: ObjectId, // Reference to Category
  template_id: ObjectId, // Reference to Template
  featured_image: ObjectId, // Reference to Media
  status: String, // "draft", "published", "archived"
  visibility: String, // "public", "private", "password_protected"
  password: String, // Optional, for password-protected content
  publish_date: Date,
  meta_title: String,
  meta_description: String,
  created_at: Date,
  updated_at: Date
}
```

### Category

Categories organize content into hierarchical structures.

```javascript
{
  company_id: ObjectId, // Reference to Company
  name: String,
  slug: String,
  description: String,
  parent_id: ObjectId, // Reference to parent Category (for hierarchical structure)
  featured_image: ObjectId, // Reference to Media
  order: Number,
  meta_title: String,
  meta_description: String,
  created_at: Date,
  updated_at: Date
}
```

### Media

Media stores files like images, documents, videos, and audio files.

```javascript
{
  company_id: ObjectId, // Reference to Company
  title: String,
  file_name: String,
  file_path: String,
  mime_type: String,
  file_size: Number,
  alt_text: String,
  caption: String,
  description: String,
  upload_by: ObjectId, // Reference to User
  dimensions: {
    width: Number,
    height: Number
  },
  media_type: String, // "image", "document", "video", "audio"
  tags: [String],
  created_at: Date,
  updated_at: Date
}
```

### Tag

Tags provide a flexible way to classify content.

```javascript
{
  company_id: ObjectId, // Reference to Company
  name: String,
  slug: String,
  description: String,
  count: Number, // Number of content items using this tag
  created_at: Date,
  updated_at: Date
}
```

### ContentTag

Junction model to establish many-to-many relationships between Content and Tags.

```javascript
{
  content_id: ObjectId, // Reference to Content
  tag_id: ObjectId, // Reference to Tag
  created_at: Date
}
```

### Template

Templates define the structure and appearance of content.

```javascript
{
  company_id: ObjectId, // Reference to Company
  name: String,
  slug: String,
  description: String,
  html_structure: String,
  css_styles: String,
  js_scripts: String,
  template_type: String, // "page", "post", "product", "landing_page", "custom"
  is_default: Boolean,
  preview_image: ObjectId, // Reference to Media
  created_by: ObjectId, // Reference to User
  created_at: Date,
  updated_at: Date
}
```

## Key Relationships

### Company-centric Data Model

The CMS extends the existing company-centric data model:

1. **Companies** remain the top-level entities
2. All CMS entities (Content, Category, Media, Tag, Template) belong to a company
3. This provides multi-tenant isolation where each company manages its own content

### Important Relationship Chains

#### Content Chain

- **Content → Company**
  - Content belongs directly to a company
  - Ensures content separation between companies

#### Media Management Chain

- **Media → Company**
  - Media files belong to a company
  - Ensures proper file organization and access control

#### Content Classification Chain

- **Content → ContentTag → Tag**
  - Content can have multiple tags
  - Tags can be applied to multiple content items
  - Junction table (ContentTag) manages the many-to-many relationship

#### Content Hierarchy Chain

- **Content → Category → Parent Category**
  - Content belongs to a category
  - Categories can have parent categories
  - Creates a hierarchical content structure

## Authorization Logic

The CMS extends the existing authorization model:

1. **Super Admin**: Can access and manage all CMS content across all companies
2. **Admin**: Can access and manage CMS content within their own company
3. **Manager**: Can access and manage specific CMS content within their company
4. **Sales/Support**: Limited access to CMS content based on their role

### Permission Checks

When accessing CMS data, the system performs these checks:

1. For content/category/tag access: Verify that the entity belongs to the user's company
2. For media access: Verify that the media belongs to the user's company
3. For template access: Verify that the template belongs to the user's company

## Integration with CRM

The CMS is integrated with the existing CRM system through:

1. **Company**: Both CRM and CMS entities belong to companies
2. **User**: Users can manage both CRM and CMS entities based on their role
3. **Content**: Content can reference CRM entities (like clients or leads) for dynamic content

## Examples of CMS Usage

1. **Company Website Management**: Create and manage website pages and blog posts
2. **Marketing Materials**: Store and organize marketing materials like brochures and presentations
3. **Knowledge Base**: Build a repository of articles and documentation
4. **Sales Collateral**: Create and manage sales-specific content for different client segments
5. **Landing Pages**: Design custom landing pages for marketing campaigns 