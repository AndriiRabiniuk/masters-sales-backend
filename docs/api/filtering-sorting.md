# Filtering and Sorting

The CMS API supports flexible filtering and sorting options for collection endpoints to help you retrieve exactly the data you need.

## Filtering

Most collection endpoints support filtering through query parameters. The general format is:

```
GET /api/cms/{resource}?field=value&another_field=another_value
```

### Common Filter Parameters

These filter parameters are available across most collection endpoints:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `status` | Filter by content status | `status=published` |
| `visibility` | Filter by content visibility | `visibility=public` |
| `created_at_from` | Created on or after the specified date (ISO 8601) | `created_at_from=2023-01-01T00:00:00.000Z` |
| `created_at_to` | Created on or before the specified date (ISO 8601) | `created_at_to=2023-12-31T23:59:59.999Z` |
| `updated_at_from` | Updated on or after the specified date (ISO 8601) | `updated_at_from=2023-01-01T00:00:00.000Z` |
| `updated_at_to` | Updated on or before the specified date (ISO 8601) | `updated_at_to=2023-12-31T23:59:59.999Z` |
| `search` | Full-text search across fields | `search=react tutorial` |

### Content-Specific Filters

Content endpoints support additional filters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `author_id` | Filter by author ID | `author_id=60d21b4667d0d8992e610c85` |
| `category_id` | Filter by category ID | `category_id=60d21b4667d0d8992e610c86` |
| `template_id` | Filter by template ID | `template_id=60d21b4667d0d8992e610c87` |
| `publish_date_from` | Published on or after the specified date (ISO 8601) | `publish_date_from=2023-01-01T00:00:00.000Z` |
| `publish_date_to` | Published on or before the specified date (ISO 8601) | `publish_date_to=2023-12-31T23:59:59.999Z` |

### Combining Filters

You can combine multiple filters in a single request:

```
GET /api/cms/content?status=published&visibility=public&category_id=60d21b4667d0d8992e610c86&search=react
```

This would return published, public content in the specified category that matches the search term "react".

### Advanced Filtering with Tags

To filter content by tags, use the dedicated endpoint:

```
GET /api/cms/tags/{tagId}/content
```

This returns all content items associated with the specified tag.

## Sorting

Most collection endpoints support sorting through the `sort` query parameter. The format is:

```
GET /api/cms/{resource}?sort=field:direction
```

Where:
- `field` is the field to sort by
- `direction` is either `asc` (ascending) or `desc` (descending)

### Common Sortable Fields

These sort fields are available across most collection endpoints:

| Field | Description | Example |
|-------|-------------|---------|
| `created_at` | Sort by creation date | `sort=created_at:desc` |
| `updated_at` | Sort by last update date | `sort=updated_at:desc` |
| `title` | Sort alphabetically by title | `sort=title:asc` |
| `order` | Sort by the order field (if applicable) | `sort=order:asc` |

### Content-Specific Sort Fields

Content endpoints support additional sort fields:

| Field | Description | Example |
|-------|-------------|---------|
| `publish_date` | Sort by publish date | `sort=publish_date:desc` |
| `status` | Sort by content status | `sort=status:asc` |
| `visibility` | Sort by content visibility | `sort=visibility:asc` |

### Default Sorting

If no sort parameter is provided, the default sort is typically:
- For content: `sort=publish_date:desc` (newest first)
- For categories: `sort=order:asc` (ordered as specified)
- For templates: `sort=created_at:desc` (newest first)
- For tags: `sort=name:asc` (alphabetical)

## Filtering and Sorting Examples

### Example 1: Published Blog Posts in a Category, Newest First

```
GET /api/cms/content?status=published&visibility=public&category_id=60d21b4667d0d8992e610c86&sort=publish_date:desc
```

### Example 2: Recent Draft Content Created by a Specific Author

```
GET /api/cms/content?status=draft&author_id=60d21b4667d0d8992e610c90&sort=updated_at:desc
```

### Example 3: Content Published in a Date Range, Alphabetically

```
GET /api/cms/content?status=published&publish_date_from=2023-01-01T00:00:00.000Z&publish_date_to=2023-12-31T23:59:59.999Z&sort=title:asc
```

### Example 4: Categories in a Specific Order

```
GET /api/cms/categories?sort=order:asc
```

## Using Filters in Frontend Code

Here's an example of how to implement filtering in a frontend application:

```javascript
// Content filtering function
async function fetchFilteredContent(filters = {}, sortField = 'publish_date', sortDirection = 'desc', page = 1, limit = 10) {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  // Add pagination params
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  
  // Add sort param
  queryParams.append('sort', `${sortField}:${sortDirection}`);
  
  // Add filter params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  // Make the API request
  const response = await fetch(`http://localhost:3001/api/cms/content?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`
    }
  });
  
  return await response.json();
}

// Example usage
async function loadFilteredContent() {
  const filters = {
    status: 'published',
    visibility: 'public',
    category_id: document.getElementById('category-select').value || null,
    search: document.getElementById('search-input').value || null,
    created_at_from: document.getElementById('date-from').value || null,
    created_at_to: document.getElementById('date-to').value || null
  };
  
  const sortField = document.getElementById('sort-field').value || 'publish_date';
  const sortDirection = document.getElementById('sort-direction').value || 'desc';
  
  try {
    const result = await fetchFilteredContent(filters, sortField, sortDirection);
    
    // Render content
    renderContentItems(result.data);
    
    // Update pagination
    renderPagination(result.pagination);
  } catch (error) {
    console.error('Error loading filtered content:', error);
  }
}

// Add event listeners to filter controls
document.getElementById('filter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  loadFilteredContent();
});

// Initial load
loadFilteredContent();
```

## Filter Form Example

Here's an HTML example of a filter form that can be used with the above JavaScript:

```html
<form id="filter-form" class="filter-controls">
  <div class="form-group">
    <label for="search-input">Search:</label>
    <input type="text" id="search-input" placeholder="Enter search terms...">
  </div>
  
  <div class="form-group">
    <label for="category-select">Category:</label>
    <select id="category-select">
      <option value="">All Categories</option>
      <!-- Populated dynamically -->
    </select>
  </div>
  
  <div class="form-group">
    <label for="date-from">From Date:</label>
    <input type="date" id="date-from">
  </div>
  
  <div class="form-group">
    <label for="date-to">To Date:</label>
    <input type="date" id="date-to">
  </div>
  
  <div class="form-group">
    <label for="sort-field">Sort By:</label>
    <select id="sort-field">
      <option value="publish_date">Publish Date</option>
      <option value="title">Title</option>
      <option value="created_at">Creation Date</option>
      <option value="updated_at">Last Updated</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="sort-direction">Order:</label>
    <select id="sort-direction">
      <option value="desc">Descending</option>
      <option value="asc">Ascending</option>
    </select>
  </div>
  
  <button type="submit" class="btn-primary">Apply Filters</button>
  <button type="reset" class="btn-secondary">Reset</button>
</form>
```

## Advanced Content Filtering UI

For more complex filtering needs, you can create a UI that dynamically builds filter queries:

```javascript
// Advanced filter builder
class ContentFilterBuilder {
  constructor() {
    this.filters = {};
    this.sortField = 'publish_date';
    this.sortDirection = 'desc';
    this.page = 1;
    this.limit = 10;
  }
  
  // Reset all filters
  reset() {
    this.filters = {};
    this.sortField = 'publish_date';
    this.sortDirection = 'desc';
    this.page = 1;
    return this;
  }
  
  // Set a filter value
  setFilter(key, value) {
    if (value === null || value === undefined || value === '') {
      delete this.filters[key];
    } else {
      this.filters[key] = value;
    }
    return this;
  }
  
  // Set date range filter
  setDateRange(field, fromDate, toDate) {
    if (fromDate) {
      this.setFilter(`${field}_from`, new Date(fromDate).toISOString());
    } else {
      delete this.filters[`${field}_from`];
    }
    
    if (toDate) {
      this.setFilter(`${field}_to`, new Date(toDate).toISOString());
    } else {
      delete this.filters[`${field}_to`];
    }
    return this;
  }
  
  // Set sorting
  setSort(field, direction = 'desc') {
    this.sortField = field;
    this.sortDirection = direction;
    return this;
  }
  
  // Set pagination
  setPagination(page, limit) {
    this.page = page;
    this.limit = limit;
    return this;
  }
  
  // Get query parameters
  getQueryParams() {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', this.page);
    queryParams.append('limit', this.limit);
    
    // Add sort param
    queryParams.append('sort', `${this.sortField}:${this.sortDirection}`);
    
    // Add filter params
    Object.entries(this.filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    return queryParams.toString();
  }
  
  // Execute the filtered query
  async execute() {
    const queryString = this.getQueryParams();
    const response = await fetch(`http://localhost:3001/api/cms/content?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    return await response.json();
  }
}

// Usage example
const filterBuilder = new ContentFilterBuilder();

// Set up event listeners
document.getElementById('search-input').addEventListener('input', (e) => {
  filterBuilder.setFilter('search', e.target.value);
});

document.getElementById('category-select').addEventListener('change', (e) => {
  filterBuilder.setFilter('category_id', e.target.value);
});

document.getElementById('status-select').addEventListener('change', (e) => {
  filterBuilder.setFilter('status', e.target.value);
});

document.getElementById('apply-date-range').addEventListener('click', () => {
  const fromDate = document.getElementById('date-from').value;
  const toDate = document.getElementById('date-to').value;
  filterBuilder.setDateRange('created_at', fromDate, toDate);
});

document.getElementById('sort-controls').addEventListener('change', () => {
  const field = document.getElementById('sort-field').value;
  const direction = document.getElementById('sort-direction').value;
  filterBuilder.setSort(field, direction);
});

document.getElementById('apply-filters').addEventListener('click', async () => {
  try {
    // Reset to page 1 when applying new filters
    filterBuilder.setPagination(1, 10);
    const result = await filterBuilder.execute();
    
    // Render content and pagination
    renderContentItems(result.data);
    renderPagination(result.pagination);
  } catch (error) {
    console.error('Error applying filters:', error);
  }
});

document.getElementById('reset-filters').addEventListener('click', () => {
  // Reset form fields
  document.getElementById('filter-form').reset();
  
  // Reset filter builder
  filterBuilder.reset();
  
  // Re-fetch data
  filterBuilder.execute().then(result => {
    renderContentItems(result.data);
    renderPagination(result.pagination);
  });
});

// Initial data load
filterBuilder.execute().then(result => {
  renderContentItems(result.data);
  renderPagination(result.pagination);
});
``` 