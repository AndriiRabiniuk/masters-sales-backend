# Error Handling

## Error Response Format

All API errors follow a standard response format:

```json
{
  "status": "error",
  "message": "Detailed error message"
}
```

## Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|--------------|
| 400 | Bad Request | Missing required fields, invalid input data, validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid authentication but insufficient permissions |
| 404 | Not Found | Resource (content, category, tag, template) not found |
| 409 | Conflict | Duplicate resource (e.g., slug already exists) |
| 422 | Unprocessable Entity | The request was valid but the server cannot process it (e.g., invalid format) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error, unexpected condition |

## Error Examples

### 400 Bad Request

```json
{
  "status": "error",
  "message": "Title is required"
}
```

### 401 Unauthorized

```json
{
  "status": "error",
  "message": "Authentication token is missing or invalid"
}
```

### 403 Forbidden

```json
{
  "status": "error",
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "status": "error",
  "message": "Content with ID 60d21b4667d0d8992e610c86 not found"
}
```

### 409 Conflict

```json
{
  "status": "error",
  "message": "Slug 'javascript-tutorial' already exists"
}
```

### 500 Internal Server Error

```json
{
  "status": "error",
  "message": "An unexpected error occurred"
}
```

## Handling Errors in Frontend

When making requests to the API, always handle potential errors. Here's an example using JavaScript fetch:

```javascript
async function fetchContent(contentId) {
  try {
    const response = await fetch(`http://localhost:3001/api/cms/content/${contentId}`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle API error
      console.error(`Error: ${data.message}`);
      // Display error to user or take appropriate action
      return null;
    }
    
    return data.data; // Return the content object
  } catch (error) {
    // Handle network or parsing errors
    console.error('Network or parsing error:', error);
    return null;
  }
}
```

## Validation Errors

For validation errors (400 Bad Request), the API might return multiple issues:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "category_id",
      "message": "Category ID must be a valid ObjectId"
    }
  ]
}
```

When handling validation errors, check for the presence of an `errors` array and display the relevant messages to the user.

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you'll receive a 429 Too Many Requests response:

```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60 // Seconds until you can retry
}
```

When receiving a 429 response, check for the `retryAfter` field to determine when you can retry the request. 