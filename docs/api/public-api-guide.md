# Public API Integration Guide

This document provides comprehensive documentation for integrating with the Masters Sales public API for courses and blogs.

## Public Blogs API

The Public Blogs API provides access to blog content without requiring authentication.

### Get All Blogs

Retrieves a paginated list of blogs, with optional filtering and search.

**Endpoint:** `GET /api/blogs`

**Query Parameters:**

| Parameter | Type    | Description                                           | Default |
|-----------|---------|-------------------------------------------------------|---------| 
| page      | integer | Page number for pagination                           | 1       |
| limit     | integer | Number of items per page                             | 10      |
| search    | string  | Search term to filter blogs by title, excerpt, etc.  | -       |
| category  | string  | Filter blogs by category name, slug, or ID           | -       |

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 3,
    "limit": 2
  },
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "id": "psychological-triggers-sales",
      "title": "7 Psychological Triggers That Drive High-Value Sales",
      "excerpt": "Discover the key psychological principles that influence purchase decisions and learn how to ethically apply them in your sales conversations.",
      "image": "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology",
      "categories": [
        {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Sales Psychology",
          "slug": "sales-psychology"
        }
      ],
      "author": "Michael Carson",
      "date": "Feb 12, 2024",
      "content": [
        {
          "heading": "Introduction",
          "paragraphs": [
            "In the competitive world of sales, understanding human psychology gives you a significant advantage.",
            "The most successful sales professionals don't rely on manipulation or pressure tactics."
          ]
        }
      ],
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    },
    // Additional blogs...
  ]
}
```

### Get Blog by ID

Retrieves a single blog by its unique identifier.

**Endpoint:** `GET /api/blogs/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "id": "psychological-triggers-sales",
    "title": "7 Psychological Triggers That Drive High-Value Sales",
    "excerpt": "Discover the key psychological principles that influence purchase decisions and learn how to ethically apply them in your sales conversations.",
    "image": "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Sales Psychology",
        "slug": "sales-psychology"
      }
    ],
    "author": "Michael Carson",
    "date": "Feb 12, 2024",
    "content": [
      {
        "heading": "Introduction",
        "paragraphs": [
          "In the competitive world of sales, understanding human psychology gives you a significant advantage.",
          "The most successful sales professionals don't rely on manipulation or pressure tactics."
        ]
      }
    ],
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-18T14:23:20.123Z"
  }
}
```

### Get All Blog Categories

Retrieves a list of all blog categories.

**Endpoint:** `GET /api/blogs/categories`

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "Sales Psychology",
      "slug": "sales-psychology"
    },
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "Sales Techniques",
      "slug": "sales-techniques"
    },
    {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Closing Strategies",
      "slug": "closing-strategies"
    }
  ]
}
```

## Public Courses API

The Public Courses API provides access to course content without requiring authentication.

### Get All Courses

Retrieves a paginated list of courses, with optional filtering and search.

**Endpoint:** `GET /api/courses`

**Query Parameters:**

| Parameter | Type    | Description                                                | Default |
|-----------|---------|------------------------------------------------------------|---------| 
| page      | integer | Page number for pagination                                | 1       |
| limit     | integer | Number of items per page                                  | 10      |
| search    | string  | Search term to filter courses by title or description     | -       |
| category  | string  | Filter courses by category name, slug, or ID              | -       |
| level     | string  | Filter courses by difficulty level                        | -       |

**Response:**

```json
{
  "status": "success",
  "results": 3,
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 2,
    "limit": 3
  },
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "id": "fundamentals-consultative-selling",
      "title": "Fundamentals of Consultative Selling",
      "description": "Learn the core principles of consultative selling and how to build meaningful client relationships based on trust.",
      "longDescription": "This comprehensive course will teach you the fundamentals of consultative selling...",
      "image": "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling",
      "categories": [
        {
          "_id": "60d21b4667d0d8992e610c88",
          "name": "Sales Skills",
          "slug": "sales-skills"
        }
      ],
      "level": "Beginner",
      "duration": "4 hours",
      "modules": 5,
      "learningOutcomes": [
        "Understand the core principles of consultative selling",
        "Develop active listening and questioning techniques"
      ],
      "moduleDetails": [
        {
          "title": "Introduction to Consultative Selling",
          "duration": "45 minutes"
        }
      ],
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    },
    // Additional courses...
  ]
}
```

### Get Course by ID

Retrieves a single course by its unique identifier.

**Endpoint:** `GET /api/courses/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "id": "fundamentals-consultative-selling",
    "title": "Fundamentals of Consultative Selling",
    "description": "Learn the core principles of consultative selling and how to build meaningful client relationships based on trust.",
    "longDescription": "This comprehensive course will teach you the fundamentals of consultative selling...",
    "image": "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c88",
        "name": "Sales Skills",
        "slug": "sales-skills"
      }
    ],
    "level": "Beginner",
    "duration": "4 hours",
    "modules": 5,
    "learningOutcomes": [
      "Understand the core principles of consultative selling",
      "Develop active listening and questioning techniques"
    ],
    "moduleDetails": [
      {
        "title": "Introduction to Consultative Selling",
        "duration": "45 minutes"
      }
    ],
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-18T14:23:20.123Z"
  }
}
```

### Get All Course Categories

Retrieves a list of all course categories.

**Endpoint:** `GET /api/courses/categories`

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Sales Skills",
      "slug": "sales-skills"
    },
    {
      "_id": "60d21b4667d0d8992e610c92",
      "name": "Consultative Selling",
      "slug": "consultative-selling"
    },
    {
      "_id": "60d21b4667d0d8992e610c93",
      "name": "Enterprise Sales",
      "slug": "enterprise-sales"
    }
  ]
}
```

### Get All Course Levels

Retrieves a list of all available course difficulty levels.

**Endpoint:** `GET /api/courses/levels`

**Response:**

```json
{
  "status": "success",
  "data": ["Beginner", "Intermediate", "Advanced"]
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `404`: Not Found (resource doesn't exist)
- `500`: Server Error

## Frontend Implementation Example

Here's a complete example of fetching and displaying blogs with React:

```javascript
import { useState, useEffect } from 'react';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs?page=${page}&limit=6`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch blogs');
        }
        
        const data = await response.json();
        setBlogs(data.data);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [page]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Blog Articles</h1>
      <div className="blogs-grid">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <img src={blog.image} alt={blog.title} />
            <h2>{blog.title}</h2>
            <p>{blog.excerpt}</p>
            <div className="blog-meta">
              <span>By: {blog.author}</span>
              <span>Date: {blog.date}</span>
            </div>
            <div className="blog-categories">
              {blog.categories.map(cat => (
                <span key={cat._id} className="category-tag">{cat.name}</span>
              ))}
            </div>
            <a href={`/blog/${blog.id}`}>Read More</a>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.pages}</span>
        <button 
          disabled={page === pagination.pages} 
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogsList;
``` 