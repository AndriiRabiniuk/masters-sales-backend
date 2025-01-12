const Course = require('../models/Course');
const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');

/**
 * Service for managing courses and blogs
 */
class ContentService {
  /**
   * Get all courses
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} List of courses
   */
  async getAllCourses(filter = {}) {
    return await Course.find(filter).sort({ created_at: -1 });
  }

  /**
   * Get course by ID
   * @param {string} id - Course ID
   * @returns {Promise<Object>} Course object
   */
  async getCourseById(id) {
    const course = await Course.findOne({ id });
    if (!course) {
      throw new ApiError('Course not found', 404);
    }
    return course;
  }

  /**
   * Get all blogs
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} List of blogs
   */
  async getAllBlogs(filter = {}) {
    return await Blog.find(filter).sort({ created_at: -1 });
  }

  /**
   * Get blog by ID
   * @param {string} id - Blog ID
   * @returns {Promise<Object>} Blog object
   */
  async getBlogById(id) {
    const blog = await Blog.findOne({ id });
    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }
    return blog;
  }

  /**
   * Get blogs by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} List of blogs in the category
   */
  async getBlogsByCategory(category) {
    return await Blog.find({ categories: { $in: [category] } }).sort({ created_at: -1 });
  }
}

module.exports = new ContentService(); 