# API Usage Examples

This document provides practical examples for common CMS operations using the API.

## Prerequisites

These examples assume you have:
1. A valid JWT token from logging in
2. The base URL set to your API server (e.g., http://localhost:3001)

## Content Management Examples

### Create and Publish a New Blog Post

```javascript
// Step 1: Create the content in draft status
async function createBlogPost() {
  const newBlogPost = {
    title: "Getting Started with React Hooks",
    content: "<p>React Hooks are a powerful feature introduced in React 16.8...</p><p>In this tutorial, we'll explore how to use useState and useEffect.</p>",
    excerpt: "Learn how to use React Hooks effectively in your projects",
    category_id: "60d21b4667d0d8992e610c85", // Web Development category
    template_id: "60d21b4667d0d8992e610c90", // Blog template
    featured_image: "60d21b4667d0d8992e610c99", // Image ID
    status: "draft",
    visibility: "public",
    meta_title: "Getting Started with React Hooks | Your Site Name",
    meta_description: "Learn how to use React Hooks effectively in your projects with our comprehensive guide to useState and useEffect."
  };

  const response = await fetch('http://localhost:3001/api/cms/content', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBlogPost)
  });

  const result = await response.json();
  return result.data; // Returns the created content with ID
}

// Step 2: Add tags to the content
async function addTagsToContent(contentId, tagIds) {
  const addTagPromises = tagIds.map(tagId => 
    fetch(`http://localhost:3001/api/cms/tags/content/${contentId}/tag/${tagId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    })
  );
  
  await Promise.all(addTagPromises);
}

// Step 3: Publish the content
async function publishContent(contentId) {
  const response = await fetch(`http://localhost:3001/api/cms/content/${contentId}/publish`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`
    }
  });

  const result = await response.json();
  return result.data; // Returns the published content
}

// Full workflow
async function createAndPublishBlogPost() {
  try {
    // Create the draft
    const draft = await createBlogPost();
    console.log('Draft created:', draft._id);
    
    // Add tags
    const tagIds = ['60d21b4667d0d8992e610c87', '60d21b4667d0d8992e610c88']; // React, JavaScript tags
    await addTagsToContent(draft._id, tagIds);
    console.log('Tags added');
    
    // Publish the content
    const published = await publishContent(draft._id);
    console.log('Content published:', published.status);
    
    return published;
  } catch (error) {
    console.error('Error in content workflow:', error);
    throw error;
  }
}
```

### Fetch Content for a Blog Listing Page

```javascript
async function fetchBlogPosts(page = 1, limit = 10, categoryId = null) {
  // Base URL for content
  let url = `http://localhost:3001/api/cms/content?page=${page}&limit=${limit}`;
  
  // If category is specified, use the category endpoint instead
  if (categoryId) {
    url = `http://localhost:3001/api/cms/content/category/${categoryId}?page=${page}&limit=${limit}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`
    }
  });
  
  const result = await response.json();
  
  // Format the posts for display
  const formattedPosts = result.data.map(post => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featured_image?.file_url || '',
    author: post.author_id?.name || 'Unknown',
    category: post.category_id?.name || 'Uncategorized',
    publishDate: new Date(post.publish_date).toLocaleDateString(),
    url: `/blog/${post.slug}`
  }));
  
  return {
    posts: formattedPosts,
    total: result.results,
    page,
    limit,
    totalPages: Math.ceil(result.results / limit)
  };
}
```

### Create a New Category

```javascript
async function createCategory() {
  const newCategory = {
    name: "React Tutorials",
    description: "Tutorials and guides for React development, including hooks, context, and state management.",
    parent_id: "60d21b4667d0d8992e610c85", // Web Development parent category
    order: 2,
    meta_title: "React Tutorials and Guides | Your Site Name",
    meta_description: "Learn React development with our comprehensive tutorials and guides covering hooks, context, and state management."
  };

  const response = await fetch('http://localhost:3001/api/cms/categories', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newCategory)
  });

  const result = await response.json();
  return result.data;
}
```

## Template Management Examples

### Fetch and Render a Template

```javascript
// Fetch a template by ID
async function fetchTemplate(templateId) {
  const response = await fetch(`http://localhost:3001/api/cms/templates/${templateId}`, {
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`
    }
  });
  
  const result = await response.json();
  return result.data;
}

// Render a template with content
function renderTemplate(template, contentData) {
  // Create a container for the template
  const container = document.createElement('div');
  
  // Create style element for the template CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = template.css_styles;
  document.head.appendChild(styleElement);
  
  // Replace template variables with actual content
  let html = template.html_structure;
  
  // Replace common variables
  html = html.replace(/{{title}}/g, contentData.title || '');
  html = html.replace(/{{content}}/g, contentData.content || '');
  html = html.replace(/{{excerpt}}/g, contentData.excerpt || '');
  html = html.replace(/{{author}}/g, contentData.author_id?.name || 'Unknown');
  html = html.replace(/{{publish_date}}/g, contentData.publish_date || '');
  html = html.replace(/{{featured_image}}/g, contentData.featured_image?.file_url || '');
  html = html.replace(/{{category}}/g, contentData.category_id?.name || 'Uncategorized');
  
  // Handle more complex replacements
  if (html.includes('{{tags}}')) {
    // Fetch tags for this content
    fetchTagsForContent(contentData._id).then(tags => {
      const tagsHtml = tags.map(tag => `<span class="tag">${tag.name}</span>`).join('');
      html = html.replace(/{{tags}}/g, tagsHtml);
      updateContent();
    });
  }
  
  // Initial content update
  function updateContent() {
    container.innerHTML = html;
  }
  updateContent();
  
  // Add the container to the page
  document.getElementById('content-container').appendChild(container);
  
  // Execute the template's JavaScript
  const scriptElement = document.createElement('script');
  scriptElement.textContent = template.js_scripts;
  document.body.appendChild(scriptElement);
  
  return container;
}

// Fetch tags for a content item
async function fetchTagsForContent(contentId) {
  const response = await fetch(`http://localhost:3001/api/cms/tags/content/${contentId}`, {
    headers: {
      'Authorization': `Bearer ${yourAuthToken}`
    }
  });
  
  const result = await response.json();
  return result.data;
}

// Usage example
async function displayContentWithTemplate(contentId) {
  try {
    // Fetch the content
    const contentResponse = await fetch(`http://localhost:3001/api/cms/content/${contentId}`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    const contentResult = await contentResponse.json();
    const content = contentResult.data;
    
    // Fetch the template used by this content
    const template = await fetchTemplate(content.template_id._id);
    
    // Render the content using the template
    renderTemplate(template, content);
  } catch (error) {
    console.error('Error displaying content with template:', error);
  }
}
```

## Category Navigation Example

```javascript
// Fetch and build category navigation
async function buildCategoryNavigation() {
  try {
    // Fetch root categories
    const rootResponse = await fetch('http://localhost:3001/api/cms/categories/root/all', {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    const rootResult = await rootResponse.json();
    const rootCategories = rootResult.data;
    
    // Build the navigation structure
    const navigation = await Promise.all(rootCategories.map(async (rootCat) => {
      // Fetch child categories
      const childrenResponse = await fetch(`http://localhost:3001/api/cms/categories/parent/${rootCat._id}`, {
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`
        }
      });
      
      const childrenResult = await childrenResponse.json();
      const children = childrenResult.data;
      
      // Build category object with children
      return {
        id: rootCat._id,
        name: rootCat.name,
        slug: rootCat.slug,
        url: `/category/${rootCat.slug}`,
        children: children.map(child => ({
          id: child._id,
          name: child.name,
          slug: child.slug,
          url: `/category/${child.slug}`,
        }))
      };
    }));
    
    return navigation;
  } catch (error) {
    console.error('Error building category navigation:', error);
    return [];
  }
}

// Render navigation in the DOM
function renderCategoryNavigation(navigation) {
  const navContainer = document.getElementById('category-nav');
  
  const navHtml = `
    <ul class="main-nav">
      ${navigation.map(category => `
        <li class="nav-item">
          <a href="${category.url}">${category.name}</a>
          ${category.children.length > 0 ? `
            <ul class="sub-nav">
              ${category.children.map(child => `
                <li class="sub-nav-item">
                  <a href="${child.url}">${child.name}</a>
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </li>
      `).join('')}
    </ul>
  `;
  
  navContainer.innerHTML = navHtml;
}

// Usage
buildCategoryNavigation().then(navigation => {
  renderCategoryNavigation(navigation);
});
```

## Tag Cloud Example

```javascript
// Fetch popular tags and create a tag cloud
async function createTagCloud(minCount = 2) {
  try {
    // Fetch tags with usage count >= minCount
    const response = await fetch(`http://localhost:3001/api/cms/tags/usage/${minCount}`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    const result = await response.json();
    const tags = result.data;
    
    // Find min and max counts for scaling
    const counts = tags.map(tag => tag.count);
    const minTagCount = Math.min(...counts);
    const maxTagCount = Math.max(...counts);
    
    // Scale font size between 0.8rem and 2rem based on count
    const scaleFontSize = (count) => {
      if (minTagCount === maxTagCount) return '1.2rem'; // All same size
      
      const scale = 0.8 + ((count - minTagCount) / (maxTagCount - minTagCount)) * 1.2;
      return `${scale}rem`;
    };
    
    // Create the tag cloud HTML
    const tagCloudContainer = document.getElementById('tag-cloud');
    
    tags.forEach(tag => {
      const tagElement = document.createElement('a');
      tagElement.href = `/tag/${tag.slug}`;
      tagElement.className = 'tag-cloud-item';
      tagElement.textContent = tag.name;
      tagElement.style.fontSize = scaleFontSize(tag.count);
      tagElement.setAttribute('data-count', tag.count);
      
      tagCloudContainer.appendChild(tagElement);
    });
    
    // Add CSS for tag cloud
    const style = document.createElement('style');
    style.textContent = `
      #tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 20px 0;
      }
      .tag-cloud-item {
        color: #444;
        text-decoration: none;
        padding: 5px 10px;
        background: #f5f5f5;
        border-radius: 15px;
        transition: background 0.2s;
      }
      .tag-cloud-item:hover {
        background: #e0e0e0;
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Error creating tag cloud:', error);
  }
}
```

These examples demonstrate the most common operations you'll need to perform with the CMS API. Adapt them to your specific use case and coding style as needed. 