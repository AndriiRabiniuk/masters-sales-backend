# Authentication

All CMS API endpoints require authentication using JWT (JSON Web Token) tokens.

## Authentication Flow

1. Obtain a valid JWT token by authenticating through the login endpoint
2. Include the token in the Authorization header of all API requests
3. Handle token expiration by refreshing when needed

## Login

To obtain a JWT token, make a request to the login endpoint:

```
POST /api/auth/login
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "your-secure-password"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d21b4667d0d8992e610c81",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin",
      "company_id": "60d21b4667d0d8992e610c80"
    }
  }
}
```

## Using the Token

Include the JWT token in the Authorization header of all API requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example Request with Authentication

```javascript
// JavaScript/Fetch example
async function fetchAllContent() {
  const response = await fetch('http://localhost:3001/api/cms/content', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}
```

```typescript
// TypeScript/Axios example
import axios from 'axios';

async function fetchAllContent() {
  try {
    const response = await axios.get('http://localhost:3001/api/cms/content', {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}
```

## Token Expiration

JWT tokens have an expiration time (usually 1 hour). When a token expires, API requests will fail with a 401 Unauthorized response:

```json
{
  "status": "error",
  "message": "Token expired"
}
```

## Refreshing Tokens

When a token expires, use the refresh token to obtain a new JWT token:

```
POST /api/auth/refresh-token
```

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // New JWT token
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New refresh token
  }
}
```

## Handling Authentication in Frontend Applications

Here's a complete example of how to handle authentication in a frontend application:

```javascript
// Authentication service
class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.apiUrl = 'http://localhost:3001/api';
  }

  // Login and store tokens
  async login(email, password) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      this.token = data.data.token;
      this.refreshToken = data.data.refreshToken;
      
      // Store tokens
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      
      return data.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout and clear tokens
  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  // Refresh the token
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh token');
      }

      this.token = data.data.token;
      this.refreshToken = data.data.refreshToken;
      
      // Update stored tokens
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      
      return this.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout(); // Force logout on refresh failure
      throw error;
    }
  }

  // Get authorization header
  getAuthHeader() {
    return { 'Authorization': `Bearer ${this.token}` };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Make authenticated API request with automatic token refresh
  async request(endpoint, options = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Add auth header to request
    const headers = {
      ...options.headers,
      ...this.getAuthHeader(),
      'Content-Type': 'application/json'
    };

    try {
      let response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers
      });

      // If token expired, try to refresh and retry the request
      if (response.status === 401) {
        const responseData = await response.json();
        
        // Only attempt refresh if the error is token expiration
        if (responseData.message === 'Token expired') {
          await this.refreshAccessToken();
          
          // Retry the request with new token
          headers.Authorization = `Bearer ${this.token}`;
          response = await fetch(`${this.apiUrl}${endpoint}`, {
            ...options,
            headers
          });
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}

// Usage example
const authService = new AuthService();

// Login
async function userLogin() {
  try {
    const user = await authService.login('user@example.com', 'password');
    console.log('Logged in as:', user.name);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Make authenticated API call
async function getAllContent() {
  try {
    const result = await authService.request('/cms/content', { method: 'GET' });
    return result.data;
  } catch (error) {
    console.error('Failed to fetch content:', error.message);
    return [];
  }
}
```

This example handles:
- Login and token storage
- Automatic token refresh on expiration
- Handling authentication errors
- Authenticated API requests 