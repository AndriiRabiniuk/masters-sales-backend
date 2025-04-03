const mongoose = require('mongoose');
const Course = require('../../models/Course');
const Blog = require('../../models/Blog');
const { courses, blogs } = require('./initialData');
require('dotenv').config();

async function seedCoursesAndBlogs() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed courses
    console.log('Seeding courses...');
    await Course.deleteMany({}); // Remove existing courses
    await Course.insertMany(courses.map(course => ({
      ...course,
      company_id: mongoose.Types.ObjectId(process.env.DEFAULT_COMPANY_ID || '000000000000000000000000')
    })));
    console.log(`${courses.length} courses seeded successfully`);

    // Seed blogs
    console.log('Seeding blogs...');
    await Blog.deleteMany({}); // Remove existing blogs
    await Blog.insertMany(blogs.map(blog => ({
      ...blog,
      company_id: mongoose.Types.ObjectId(process.env.DEFAULT_COMPANY_ID || '000000000000000000000000')
    })));
    console.log(`${blogs.length} blogs seeded successfully`);

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedCoursesAndBlogs(); 