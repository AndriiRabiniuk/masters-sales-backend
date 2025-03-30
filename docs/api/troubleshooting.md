# Troubleshooting Guide

This guide helps you identify and resolve common issues when working with the CMS API.

## Common HTTP Error Codes

| Status Code | Error | Common Causes | Solution |
|-------------|-------|---------------|----------|
| 400 | Bad Request | Invalid request format, missing required fields, validation errors | Check your request payload against the API documentation requirements |
| 401 | Unauthorized | Missing or invalid authentication token | Ensure you're including a valid JWT token in your Authorization header |
| 403 | Forbidden | Insufficient permissions for the requested operation | Verify your user has the necessary permissions for the action |
| 404 | Not Found | The requested resource doesn't exist | Check the ID or path of the resource you're trying to access |
| 409 | Conflict | Resource already exists, version conflicts | Check if you're trying to create a duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded | Reduce the frequency of your requests or implement backoff strategies |
| 500 | Server Error | Internal server error | Report the issue to the API support team with details of your request |

## Authentication Issues

### Token Expired

**Symptoms:**
- 401 Unauthorized response
- Error message indicating token expiration

**Solutions:**
1. Use the refresh token to obtain a new access token:
   ```javascript
   async function refreshToken() {
     const refreshToken = localStorage.getItem('refreshToken');
     
     const response = await fetch('http://localhost:3001/api/auth/refresh-token', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ refresh_token: refreshToken })
     });
     
     if (!response.ok) {
       // If refresh fails, redirect to login
       window.location.href = '/login';
       return null;
     }
     
     const result = await response.json();
     
     // Save the new tokens
     localStorage.setItem('token', result.data.token);
     localStorage.setItem('refreshToken', result.data.refresh_token);
     
     return result.data.token;
   }
   ```

2. Implement an automatic retry with token refresh:
   ```javascript
   async function apiRequest(url, options = {}) {
     // Add auth token to request if available
     const token = localStorage.getItem('token');
     
     if (token) {
       options.headers = {
         ...options.headers,
         'Authorization': `Bearer ${token}`
       };
     }
     
     let response = await fetch(url, options);
     
     // If unauthorized due to expired token
     if (response.status === 401) {
       const newToken = await refreshToken();
       
       if (newToken) {
         // Retry the request with new token
         options.headers = {
           ...options.headers,
           'Authorization': `Bearer ${newToken}`
         };
         
         response = await fetch(url, options);
       }
     }
     
     return response;
   }
   ```

### Invalid Credentials

**Symptoms:**
- 401 Unauthorized response on login
- Error message about invalid username or password

**Solutions:**
1. Double-check username and password
2. Ensure you're using the correct login endpoint
3. Implement a password reset flow if available

## Request Format Issues

### Invalid JSON

**Symptoms:**
- 400 Bad Request response
- Error message about invalid JSON

**Solution:**
1. Validate your JSON before sending:
   ```javascript
   function validateJSON(jsonString) {
     try {
       JSON.parse(jsonString);
       return true;
     } catch (e) {
       console.error('Invalid JSON:', e);
       return false;
     }
   }
   ```

2. Use a linter or validation tool before sending requests

### Missing Required Fields

**Symptoms:**
- 400 Bad Request response
- Error message listing missing fields

**Solution:**
1. Implement frontend validation that matches API requirements:
   ```javascript
   function validateContentRequest(content) {
     const requiredFields = ['title', 'content', 'category_id', 'template_id'];
     const missingFields = [];
     
     requiredFields.forEach(field => {
       if (!content[field]) {
         missingFields.push(field);
       }
     });
     
     if (missingFields.length) {
       throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
     }
     
     return true;
   }
   ```

## Validation Errors

### Invalid Field Values

**Symptoms:**
- 400 Bad Request response
- Detailed validation errors in response

**Solutions:**
1. Check the validation rules in the API documentation
2. Implement frontend validation that matches API validation:
   ```javascript
   const validationRules = {
     title: {
       minLength: 3,
       maxLength: 255,
       pattern: /^[A-Za-z0-9\s\-_,.!?()]+$/
     },
     content: {
       minLength: 10
     },
     // Add rules for other fields
   };
   
   function validateField(field, value) {
     const rules = validationRules[field];
     
     if (!rules) return true;
     
     if (rules.minLength && value.length < rules.minLength) {
       return `${field} must be at least ${rules.minLength} characters`;
     }
     
     if (rules.maxLength && value.length > rules.maxLength) {
       return `${field} must be no more than ${rules.maxLength} characters`;
     }
     
     if (rules.pattern && !rules.pattern.test(value)) {
       return `${field} contains invalid characters`;
     }
     
     return true;
   }
   ```

## Performance Issues

### Slow API Responses

**Symptoms:**
- API requests take a long time to complete
- Timeouts

**Solutions:**
1. Optimize your queries by using filtering and pagination:
   ```javascript
   // Instead of fetching all content
   fetch('/api/cms/content')
   
   // Use pagination and filtering
   fetch('/api/cms/content?page=1&limit=10&status=published')
   ```

2. Implement caching for frequently accessed data:
   ```javascript
   const cache = new Map();
   
   async function fetchWithCache(url, options = {}, cacheDuration = 60000) {
     // Check if we have a cached version and it's still valid
     if (cache.has(url)) {
       const cachedData = cache.get(url);
       if (cachedData.timestamp > Date.now() - cacheDuration) {
         return cachedData.data;
       }
     }
     
     // If no cache or expired, fetch from API
     const response = await fetch(url, options);
     const data = await response.json();
     
     // Cache the result
     cache.set(url, {
       timestamp: Date.now(),
       data
     });
     
     return data;
   }
   ```

3. Implement data prefetching where appropriate:
   ```javascript
   // When a user hovers over a category, prefetch its content
   document.querySelector('.category-link').addEventListener('mouseenter', () => {
     const categoryId = this.dataset.categoryId;
     prefetchCategoryContent(categoryId);
   });
   
   function prefetchCategoryContent(categoryId) {
     fetch(`/api/cms/content/category/${categoryId}?page=1&limit=10`)
       .then(response => response.json())
       .then(data => {
         // Store in cache for when user actually clicks
         sessionStorage.setItem(`category_${categoryId}`, JSON.stringify(data));
       })
       .catch(err => console.log('Prefetch error (non-critical):', err));
   }
   ```

### Rate Limiting

**Symptoms:**
- 429 Too Many Requests responses
- Headers indicating rate limit exceeded

**Solutions:**
1. Implement exponential backoff and retry:
   ```javascript
   async function fetchWithRetry(url, options = {}, maxRetries = 3) {
     let retries = 0;
     
     while (retries < maxRetries) {
       try {
         const response = await fetch(url, options);
         
         if (response.status === 429) {
           // Get retry-after header if available
           const retryAfter = response.headers.get('Retry-After') || Math.pow(2, retries);
           const waitTime = parseInt(retryAfter, 10) * 1000;
           
           console.log(`Rate limited. Retrying in ${waitTime}ms...`);
           await new Promise(resolve => setTimeout(resolve, waitTime));
           retries++;
         } else {
           return response;
         }
       } catch (error) {
         retries++;
         console.error(`Fetch error (retry ${retries}/${maxRetries}):`, error);
         
         if (retries >= maxRetries) {
           throw error;
         }
         
         // Wait before retrying
         await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
       }
     }
   }
   ```

2. Batch API requests where possible:
   ```javascript
   // Instead of multiple separate requests
   content.tags.forEach(tagId => {
     fetch(`/api/cms/tags/content/${contentId}/tag/${tagId}`, { method: 'POST' });
   });
   
   // Use bulk operations when available
   fetch(`/api/cms/tags/content/${contentId}/bulk`, {
     method: 'POST',
     body: JSON.stringify({ tag_ids: content.tags })
   });
   ```

## File Upload Issues

### File Size Limits

**Symptoms:**
- 413 Payload Too Large response
- Upload failures for large files

**Solutions:**
1. Implement client-side file size validation:
   ```javascript
   function validateFileSize(file, maxSizeMB = 5) {
     const maxSizeBytes = maxSizeMB * 1024 * 1024;
     
     if (file.size > maxSizeBytes) {
       alert(`File too large. Maximum size is ${maxSizeMB}MB.`);
       return false;
     }
     
     return true;
   }
   
   document.getElementById('fileUpload').addEventListener('change', (e) => {
     const file = e.target.files[0];
     if (!validateFileSize(file)) {
       e.target.value = ''; // Clear the file input
     }
   });
   ```

2. Implement file compression before upload:
   ```javascript
   async function compressImage(file, maxWidthHeight = 1200, quality = 0.8) {
     return new Promise((resolve) => {
       const reader = new FileReader();
       reader.onload = function(e) {
         const img = new Image();
         img.onload = function() {
           const canvas = document.createElement('canvas');
           let width = img.width;
           let height = img.height;
           
           if (width > height) {
             if (width > maxWidthHeight) {
               height = Math.round(height * maxWidthHeight / width);
               width = maxWidthHeight;
             }
           } else {
             if (height > maxWidthHeight) {
               width = Math.round(width * maxWidthHeight / height);
               height = maxWidthHeight;
             }
           }
           
           canvas.width = width;
           canvas.height = height;
           
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0, width, height);
           
           canvas.toBlob((blob) => {
             resolve(new File([blob], file.name, {
               type: 'image/jpeg',
               lastModified: Date.now()
             }));
           }, 'image/jpeg', quality);
         };
         img.src = e.target.result;
       };
       reader.readAsDataURL(file);
     });
   }
   ```

## Network and CORS Issues

### Cross-Origin Resource Sharing (CORS) Errors

**Symptoms:**
- Console errors about CORS policy
- Requests failing in the browser but working in Postman

**Solutions:**
1. Ensure you're using the correct protocol and domain
2. Contact the API administrator to add your domain to the allowed origins
3. Use a proxy server for development purposes:
   ```javascript
   // In package.json for React apps
   {
     "proxy": "http://localhost:3001"
   }
   ```

### Network Connectivity

**Symptoms:**
- Intermittent failures
- Timeout errors

**Solutions:**
1. Implement online/offline detection:
   ```javascript
   function setupConnectivityMonitoring() {
     window.addEventListener('online', () => {
       console.log('Back online, resuming operations');
       processOfflineQueue();
     });
     
     window.addEventListener('offline', () => {
       console.log('Offline, requests will be queued');
     });
     
     // Check connection before important operations
     function isOnline() {
       return navigator.onLine;
     }
     
     // Queue for storing operations while offline
     const offlineQueue = [];
     
     function queueOperation(operation) {
       offlineQueue.push(operation);
       localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
     }
     
     function processOfflineQueue() {
       const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
       
       if (queue.length === 0) return;
       
       console.log(`Processing ${queue.length} queued operations`);
       
       queue.forEach(async (operation, index) => {
         try {
           // Execute the queued operation
           await fetch(operation.url, operation.options);
           
           // Remove from queue if successful
           queue.splice(index, 1);
           localStorage.setItem('offlineQueue', JSON.stringify(queue));
         } catch (error) {
           console.error('Error processing queued operation:', error);
         }
       });
     }
   }
   ```

## Debugging Strategies

### Request Inspection

Use browser developer tools to inspect network requests:

1. Open Developer Tools (F12 or Ctrl+Shift+I / Cmd+Option+I)
2. Go to the Network tab
3. Filter for XHR or Fetch requests
4. Check request headers, body, and response

### Logging

Implement comprehensive logging for API interactions:

```javascript
class ApiLogger {
  static log(type, url, data = null, error = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      url,
      data,
      error: error ? error.toString() : null
    };
    
    console.log(`[API ${type}]`, logEntry);
    
    // Optionally store logs for debugging
    const logs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }
    
    localStorage.setItem('apiLogs', JSON.stringify(logs));
  }
  
  static request(url, options) {
    this.log('REQUEST', url, options);
  }
  
  static success(url, data) {
    this.log('SUCCESS', url, data);
  }
  
  static error(url, error, data = null) {
    this.log('ERROR', url, data, error);
  }
  
  static downloadLogs() {
    const logs = localStorage.getItem('apiLogs') || '[]';
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Usage in API wrapper
async function apiRequest(url, options = {}) {
  ApiLogger.request(url, options);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      ApiLogger.error(url, new Error(`Status ${response.status}`), data);
      throw new Error(`API Error: ${data.message || 'Unknown error'}`);
    }
    
    ApiLogger.success(url, data);
    return data;
  } catch (error) {
    ApiLogger.error(url, error);
    throw error;
  }
}
```

## Getting Help

If you've tried the troubleshooting steps and still encounter issues:

1. **Check Documentation:** Make sure you've thoroughly read the relevant API documentation.

2. **Review Error Messages:** The API provides detailed error messages to help diagnose issues.

3. **Contact Support:** Reach out to the API support team with:
   - A clear description of the issue
   - The API endpoint you're trying to access
   - Any error messages or status codes
   - Steps to reproduce the problem
   - Relevant code snippets (with sensitive information removed)

4. **Community Resources:** Check if there's a community forum or Stack Overflow tag for the API.

---

By following these troubleshooting guidelines, you should be able to resolve most common issues encountered when working with the CMS API. 