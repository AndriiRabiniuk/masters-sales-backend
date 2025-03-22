/**
 * Pagination utility for API responses
 * @param {Object} model - Mongoose model
 * @param {Object} query - Query object for filtering
 * @param {Object} options - Pagination options (page, limit, populate, sort)
 * @returns {Object} - Paginated results
 */
const paginateResults = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Clone query to avoid modifying the original
  const searchQuery = { ...query };
  
  // Add text search if search parameter is provided
  if (options.search && options.searchFields && options.searchFields.length > 0) {
    const searchRegex = new RegExp(options.search, 'i');
    searchQuery.$or = options.searchFields.map(field => ({
      [field]: searchRegex
    }));
  }

  // Count total documents
  const total = await model.countDocuments(searchQuery);
  
  // Build the query
  let dataQuery = model.find(searchQuery).skip(skip).limit(limit);
  
  // Add populate if specified
  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach(field => {
        dataQuery = dataQuery.populate(field);
      });
    } else {
      dataQuery = dataQuery.populate(options.populate);
    }
  }
  
  // Add sort if specified
  if (options.sort) {
    dataQuery = dataQuery.sort(options.sort);
  }
  
  // Execute query
  const data = await dataQuery;
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    page,
    limit,
    totalPages,
    total
  };
};

module.exports = { paginateResults }; 