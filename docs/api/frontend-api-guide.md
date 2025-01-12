# Frontend API Integration Guide

This document provides comprehensive documentation for integrating with the Masters Sales Backend API for courses and blogs.

## Authentication

All API endpoints require authentication using a Bearer token.

**Example:**
```javascript
const fetchData = async (endpoint) => {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## Courses API

### Get All Courses

Retrieves a paginated list of courses, with optional filtering and search.

**Endpoint:** `GET /api/cms/courses`

**Query Parameters:**

| Parameter | Type    | Description                                                | Default |
|-----------|---------|------------------------------------------------------------|---------| 
| page      | integer | Page number for pagination                                | 1       |
| limit     | integer | Number of items per page                                  | 10      |
| search    | string  | Search term to filter courses by title or description     | -       |
| category  | string  | Filter courses by category ID                             | -       |
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
      "company_id": "60d21b4667d0d8992e610c80",
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

**Endpoint:** `GET /api/cms/courses/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
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

### Get Course Levels

Retrieves a list of all available course difficulty levels.

**Endpoint:** `GET /api/cms/courses/levels`

**Response:**

```json
{
  "status": "success",
  "data": ["Beginner", "Intermediate", "Advanced"]
}
```

### Create Course

Creates a new course.

**Endpoint:** `POST /api/cms/courses`

**Request Body:**

```json
{
  "id": "fundamentals-consultative-selling",
  "title": "Fundamentals of Consultative Selling",
  "description": "Learn the core principles of consultative selling and how to build meaningful client relationships based on trust.",
  "longDescription": "This comprehensive course will teach you the fundamentals of consultative selling...",
  "image": "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling",
  "categories": ["60d21b4667d0d8992e610c88"],
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
  ]
}
```

**Important Notes:**
- The `id` field should be unique and URL-friendly (slugified)
- The `categories` field must contain an array of valid, existing category MongoDB IDs
- All required fields must be provided

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
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

### Update Course

Updates an existing course by ID.

**Endpoint:** `PUT /api/cms/courses/:id`

**Request Body:**

```json
{
  "title": "Updated Fundamentals of Consultative Selling",
  "description": "Updated description...",
  "categories": ["60d21b4667d0d8992e610c88", "60d21b4667d0d8992e610c89"],
  "level": "Intermediate"
}
```

**Important Notes:**
- Only include fields you want to update
- The `categories` field must contain an array of valid, existing category MongoDB IDs
- To clear categories, send `null` or an empty array

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "company_id": "60d21b4667d0d8992e610c80",
    "id": "fundamentals-consultative-selling",
    "title": "Updated Fundamentals of Consultative Selling",
    "description": "Updated description...",
    "longDescription": "This comprehensive course will teach you the fundamentals of consultative selling...",
    "image": "https://placehold.co/600x400/111827/6B7280?text=Consultative+Selling",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c88",
        "name": "Sales Skills",
        "slug": "sales-skills"
      },
      {
        "_id": "60d21b4667d0d8992e610c89",
        "name": "Consultative Selling",
        "slug": "consultative-selling"
      }
    ],
    "level": "Intermediate",
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
    "updated_at": "2023-06-19T10:15:32.456Z"
  }
}
```

### Delete Course

Deletes a course by ID.

**Endpoint:** `DELETE /api/cms/courses/:id`

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

## Blogs API

### Get All Blogs

Retrieves a paginated list of blogs, with optional filtering and search.

**Endpoint:** `GET /api/cms/blogs`

**Query Parameters:**

| Parameter | Type    | Description                                           | Default |
|-----------|---------|-------------------------------------------------------|---------| 
| page      | integer | Page number for pagination                           | 1       |
| limit     | integer | Number of items per page                             | 10      |
| search    | string  | Search term to filter blogs by title, excerpt, etc.  | -       |
| category  | string  | Filter blogs by category ID                          | -       |

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
      "company_id": "60d21b4667d0d8992e610c80",
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

**Endpoint:** `GET /api/cms/blogs/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "company_id": "60d21b4667d0d8992e610c80",
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

### Create Blog

Creates a new blog.

**Endpoint:** `POST /api/cms/blogs`

**Request Body:**

```json
{
  "id": "psychological-triggers-sales",
  "title": "7 Psychological Triggers That Drive High-Value Sales",
  "excerpt": "Discover the key psychological principles that influence purchase decisions and learn how to ethically apply them in your sales conversations.",
  "image": "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology",
  "categories": ["60d21b4667d0d8992e610c87"],
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
  ]
}
```

**Important Notes:**
- The `id` field should be unique and URL-friendly (slugified)
- The `categories` field must contain an array of valid, existing category MongoDB IDs
- All required fields must be provided
- `date` format is flexible but should be consistent

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "company_id": "60d21b4667d0d8992e610c80",
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

### Update Blog

Updates an existing blog by ID.

**Endpoint:** `PUT /api/cms/blogs/:id`

**Request Body:**

```json
{
  "title": "Updated: 7 Psychological Triggers That Drive High-Value Sales",
  "excerpt": "Updated excerpt...",
  "categories": ["60d21b4667d0d8992e610c87", "60d21b4667d0d8992e610c89"]
}
```

**Important Notes:**
- Only include fields you want to update
- The `categories` field must contain an array of valid, existing category MongoDB IDs
- To clear categories, send `null` or an empty array

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "company_id": "60d21b4667d0d8992e610c80",
    "id": "psychological-triggers-sales",
    "title": "Updated: 7 Psychological Triggers That Drive High-Value Sales",
    "excerpt": "Updated excerpt...",
    "image": "https://placehold.co/600x400/111827/6B7280?text=Sales+Psychology",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Sales Psychology",
        "slug": "sales-psychology"
      },
      {
        "_id": "60d21b4667d0d8992e610c89",
        "name": "Sales Techniques",
        "slug": "sales-techniques"
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
    "updated_at": "2023-06-19T10:15:32.456Z"
  }
}
```

### Delete Blog

Deletes a blog by ID.

**Endpoint:** `DELETE /api/cms/blogs/:id`

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

## Category APIs

Since content creation and updates require valid category IDs, the category APIs are essential for frontend integration.

### Blog Categories

#### Get All Blog Categories

Retrieves a paginated list of blog categories.

**Endpoint:** `GET /api/cms/blog-categories`

**Query Parameters:**

| Parameter | Type    | Description                                      | Default |
|-----------|---------|--------------------------------------------------|---------| 
| page      | integer | Page number for pagination                      | 1       |
| limit     | integer | Number of items per page                        | 10      |
| search    | string  | Search term to filter categories by name        | -       |

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
      "_id": "60d21b4667d0d8992e610c87",
      "company_id": "60d21b4667d0d8992e610c80",
      "name": "Sales Psychology",
      "slug": "sales-psychology",
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c89",
      "company_id": "60d21b4667d0d8992e610c80",
      "name": "Sales Techniques",
      "slug": "sales-techniques",
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c90",
      "company_id": "60d21b4667d0d8992e610c80",
      "name": "Closing Strategies",
      "slug": "closing-strategies",
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    }
  ]
}
```

#### Get Blog Category by ID

Retrieves a single blog category by its unique identifier.

**Endpoint:** `GET /api/cms/blog-categories/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "company_id": "60d21b4667d0d8992e610c80",
    "name": "Sales Psychology",
    "slug": "sales-psychology",
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-18T14:23:20.123Z"
  }
}
```

#### Create Blog Category

Creates a new blog category.

**Endpoint:** `POST /api/cms/blog-categories`

**Request Body:**

```json
{
  "name": "Negotiation Skills",
  "slug": "negotiation-skills"
}
```

**Note:** If `slug` is not provided, it will be automatically generated from the name.

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c91",
    "company_id": "60d21b4667d0d8992e610c80",
    "name": "Negotiation Skills",
    "slug": "negotiation-skills",
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-18T14:23:20.123Z"
  }
}
```

#### Update Blog Category

Updates an existing blog category.

**Endpoint:** `PUT /api/cms/blog-categories/:id`

**Request Body:**

```json
{
  "name": "Advanced Negotiation Skills",
  "slug": "advanced-negotiation-skills"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c91",
    "company_id": "60d21b4667d0d8992e610c80",
    "name": "Advanced Negotiation Skills",
    "slug": "advanced-negotiation-skills",
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-19T10:15:32.456Z"
  }
}
```

#### Delete Blog Category

Deletes a blog category.

**Endpoint:** `DELETE /api/cms/blog-categories/:id`

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

### Course Categories

#### Get All Course Categories

Retrieves a paginated list of course categories.

**Endpoint:** `GET /api/cms/course-categories`

**Query Parameters:**

| Parameter | Type    | Description                                      | Default |
|-----------|---------|--------------------------------------------------|---------| 
| page      | integer | Page number for pagination                      | 1       |
| limit     | integer | Number of items per page                        | 10      |
| search    | string  | Search term to filter categories by name        | -       |

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
      "_id": "60d21b4667d0d8992e610c88",
      "company_id": "60d21b4667d0d8992e610c80",
      "name": "Sales Skills",
      "slug": "sales-skills",
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c92",
      "company_id": "60d21b4667d0d8992e610c80",
      "name": "Consultative Selling",
      "slug": "consultative-selling",
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c93",
      "company_id": "60d21b4667d0d8992e610c80",
      "name": "Enterprise Sales",
      "slug": "enterprise-sales",
      "created_at": "2023-06-18T14:23:20.123Z",
      "updated_at": "2023-06-18T14:23:20.123Z"
    }
  ]
}
```

#### Get Course Category by ID

Retrieves a single course category by its unique identifier.

**Endpoint:** `GET /api/cms/course-categories/:id`

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "company_id": "60d21b4667d0d8992e610c80",
    "name": "Sales Skills",
    "slug": "sales-skills",
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-18T14:23:20.123Z"
  }
}
```

#### Create Course Category

Creates a new course category.

**Endpoint:** `POST /api/cms/course-categories`

**Request Body:**

```json
{
  "name": "Objection Handling",
  "slug": "objection-handling"
}
```

**Note:** If `slug` is not provided, it will be automatically generated from the name.

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c94",
    "company_id": "60d21b4667d0d8992e610c80",
    "name": "Objection Handling",
    "slug": "objection-handling",
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-18T14:23:20.123Z"
  }
}
```

#### Update Course Category

Updates an existing course category.

**Endpoint:** `PUT /api/cms/course-categories/:id`

**Request Body:**

```json
{
  "name": "Advanced Objection Handling",
  "slug": "advanced-objection-handling"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "60d21b4667d0d8992e610c94",
    "company_id": "60d21b4667d0d8992e610c80",
    "name": "Advanced Objection Handling",
    "slug": "advanced-objection-handling",
    "created_at": "2023-06-18T14:23:20.123Z",
    "updated_at": "2023-06-19T10:15:32.456Z"
  }
}
```

#### Delete Course Category

Deletes a course category.

**Endpoint:** `DELETE /api/cms/course-categories/:id`

**Response:**

```json
{
  "status": "success",
  "data": null
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
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid or missing token)
- `404`: Not Found (resource doesn't exist)
- `500`: Server Error

## Categories

For both blogs and courses, you must use existing category IDs when creating or updating content. The system will not automatically create categories from string names.

## Frontend Implementation Example

Here's a complete example of fetching courses with React:

```javascript
import { useState, useEffect } from 'react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  // Get token from your auth system
  const token = localStorage.getItem('authToken');
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cms/courses?page=${page}&limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch courses');
        }
        
        const data = await response.json();
        setCourses(data.data);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [page, token]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Courses</h1>
      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.title} />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="course-meta">
              <span>Level: {course.level}</span>
              <span>Duration: {course.duration}</span>
            </div>
            <div className="course-categories">
              {course.categories.map(cat => (
                <span key={cat._id} className="category-tag">{cat.name}</span>
              ))}
            </div>
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

export default CoursesList;
``` 