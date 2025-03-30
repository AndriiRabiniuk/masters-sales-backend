# Pagination

The CMS API uses a consistent pagination mechanism across all collection endpoints to make it easy to navigate through large sets of data.

## How Pagination Works

All endpoints that return multiple items support pagination with the following query parameters:

- `page`: The page number to retrieve (starts at 1)
- `limit`: The number of items per page (defaults to 10, maximum 100)

## Standard Pagination Response

All paginated responses follow this structure:

```json
{
  "success": true,
  "results": 145,
  "data": [
    // Array of items for the current page
  ],
  "pagination": {
    "current_page": 2,
    "limit": 10,
    "total_pages": 15,
    "next_page": 3,
    "prev_page": 1
  }
}
```

| Field | Description |
|-------|-------------|
| `success` | Indicates if the request was successful |
| `results` | The total number of items across all pages |
| `data` | Array of items for the current page |
| `pagination.current_page` | The current page number |
| `pagination.limit` | Number of items per page |
| `pagination.total_pages` | Total number of pages |
| `pagination.next_page` | Next page number (null if on last page) |
| `pagination.prev_page` | Previous page number (null if on first page) |

## Pagination Example

### Request

```
GET /api/cms/content?page=2&limit=10
```

### Response

```json
{
  "success": true,
  "results": 35,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Getting Started with React",
      "status": "published",
      "created_at": "2023-01-10T12:00:00.000Z",
      // ...other content fields
    },
    // ... 9 more items
  ],
  "pagination": {
    "current_page": 2,
    "limit": 10,
    "total_pages": 4,
    "next_page": 3,
    "prev_page": 1
  }
}
```

## Implementing Pagination in the Frontend

Here's an example of how to implement pagination in a frontend application:

```javascript
// Fetch paginated content
async function fetchPaginatedContent(page = 1, limit = 10) {
  const response = await fetch(`http://localhost:3001/api/cms/content?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`
    }
  });
  
  return await response.json();
}

// Render pagination controls
function renderPaginationControls(pagination) {
  const { current_page, total_pages, next_page, prev_page } = pagination;
  
  const paginationContainer = document.getElementById('pagination-controls');
  
  // Clear previous controls
  paginationContainer.innerHTML = '';
  
  // Previous button
  const prevButton = document.createElement('button');
  prevButton.textContent = '« Previous';
  prevButton.disabled = prev_page === null;
  prevButton.addEventListener('click', () => {
    if (prev_page) loadPage(prev_page);
  });
  paginationContainer.appendChild(prevButton);
  
  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);
  
  // Adjust start if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // First page button if needed
  if (startPage > 1) {
    const firstPageButton = document.createElement('button');
    firstPageButton.textContent = '1';
    firstPageButton.addEventListener('click', () => loadPage(1));
    paginationContainer.appendChild(firstPageButton);
    
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.className = 'pagination-ellipsis';
      paginationContainer.appendChild(ellipsis);
    }
  }
  
  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i.toString();
    pageButton.className = i === current_page ? 'current-page' : '';
    pageButton.addEventListener('click', () => {
      if (i !== current_page) loadPage(i);
    });
    paginationContainer.appendChild(pageButton);
  }
  
  // Last page button if needed
  if (endPage < total_pages) {
    if (endPage < total_pages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.className = 'pagination-ellipsis';
      paginationContainer.appendChild(ellipsis);
    }
    
    const lastPageButton = document.createElement('button');
    lastPageButton.textContent = total_pages.toString();
    lastPageButton.addEventListener('click', () => loadPage(total_pages));
    paginationContainer.appendChild(lastPageButton);
  }
  
  // Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next »';
  nextButton.disabled = next_page === null;
  nextButton.addEventListener('click', () => {
    if (next_page) loadPage(next_page);
  });
  paginationContainer.appendChild(nextButton);
}

// Load a specific page of content
async function loadPage(page) {
  try {
    const result = await fetchPaginatedContent(page);
    
    // Render the content items
    const contentContainer = document.getElementById('content-list');
    contentContainer.innerHTML = '';
    
    result.data.forEach(item => {
      const element = document.createElement('div');
      element.className = 'content-item';
      element.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt || ''}</p>
        <a href="/content/${item._id}">Read more</a>
      `;
      contentContainer.appendChild(element);
    });
    
    // Update pagination controls
    renderPaginationControls(result.pagination);
    
    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error loading page:', error);
  }
}

// Initial load
loadPage(1);
```

## Common Pagination Patterns

### Infinite Scroll

To implement infinite scroll instead of traditional pagination:

```javascript
let currentPage = 1;
let isLoading = false;
let hasMoreContent = true;

// Load more content
async function loadMoreContent() {
  if (isLoading || !hasMoreContent) return;
  
  isLoading = true;
  document.getElementById('loading-indicator').style.display = 'block';
  
  try {
    const result = await fetchPaginatedContent(currentPage);
    
    // Append new content
    const contentContainer = document.getElementById('content-list');
    
    result.data.forEach(item => {
      const element = document.createElement('div');
      element.className = 'content-item';
      element.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt || ''}</p>
        <a href="/content/${item._id}">Read more</a>
      `;
      contentContainer.appendChild(element);
    });
    
    // Update pagination state
    currentPage++;
    hasMoreContent = result.pagination.next_page !== null;
    
    // Hide loading indicator and loading state
    document.getElementById('loading-indicator').style.display = 'none';
    isLoading = false;
    
    // If no more content, show end message
    if (!hasMoreContent) {
      const endMessage = document.createElement('div');
      endMessage.className = 'end-message';
      endMessage.textContent = 'No more content to load';
      contentContainer.appendChild(endMessage);
    }
  } catch (error) {
    console.error('Error loading more content:', error);
    document.getElementById('loading-indicator').style.display = 'none';
    isLoading = false;
  }
}

// Detect when user scrolls near bottom
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreContent();
  }
});

// Initial load
loadMoreContent();
```

### Load More Button

To implement a "Load More" button approach:

```javascript
let currentPage = 1;
let isLoading = false;
let hasMoreContent = true;

// Load more content when button is clicked
document.getElementById('load-more-button').addEventListener('click', async () => {
  if (isLoading || !hasMoreContent) return;
  
  isLoading = true;
  const loadMoreButton = document.getElementById('load-more-button');
  loadMoreButton.textContent = 'Loading...';
  loadMoreButton.disabled = true;
  
  try {
    const result = await fetchPaginatedContent(currentPage);
    
    // Append new content
    const contentContainer = document.getElementById('content-list');
    
    result.data.forEach(item => {
      const element = document.createElement('div');
      element.className = 'content-item';
      element.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt || ''}</p>
        <a href="/content/${item._id}">Read more</a>
      `;
      contentContainer.appendChild(element);
    });
    
    // Update pagination state
    currentPage++;
    hasMoreContent = result.pagination.next_page !== null;
    
    // Update button state
    loadMoreButton.textContent = 'Load More';
    loadMoreButton.disabled = false;
    isLoading = false;
    
    // Hide button if no more content
    if (!hasMoreContent) {
      loadMoreButton.style.display = 'none';
      const endMessage = document.createElement('div');
      endMessage.className = 'end-message';
      endMessage.textContent = 'No more content to load';
      contentContainer.appendChild(endMessage);
    }
  } catch (error) {
    console.error('Error loading more content:', error);
    loadMoreButton.textContent = 'Load More';
    loadMoreButton.disabled = false;
    isLoading = false;
  }
});

// Initial load
(async () => {
  const result = await fetchPaginatedContent(currentPage);
  
  // Render initial content
  const contentContainer = document.getElementById('content-list');
  
  result.data.forEach(item => {
    const element = document.createElement('div');
    element.className = 'content-item';
    element.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.excerpt || ''}</p>
      <a href="/content/${item._id}">Read more</a>
    `;
    contentContainer.appendChild(element);
  });
  
  // Update pagination state
  currentPage++;
  hasMoreContent = result.pagination.next_page !== null;
  
  // Hide button if no more content
  if (!hasMoreContent) {
    document.getElementById('load-more-button').style.display = 'none';
  }
})();
``` 