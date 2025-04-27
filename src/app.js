const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const leadRoutes = require('./routes/leadRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const noteRoutes = require('./routes/noteRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cmsRoutes = require('./routes/cms');
const mediaRoutes = require('./routes/mediaRoutes');
const publicBlogRoutes = require('./routes/public/blog.routes');
const publicCourseRoutes = require('./routes/public/course.routes');
const publicUserRoutes = require('./routes/public/user.routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN || '*' 
    : '*',
  credentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser for refresh tokens
app.use(morgan('dev'));

// Initialize Passport
app.use(passport.initialize());
require('./config/passport');

// API Documentation
app.use('/cms/swagger', swaggerUi.serve, (req, res  ) => {
  let html = swaggerUi.generateHTML(swaggerDocs.cmsSwaggerDocs);
  res.send(html );
});
app.use('/crm/swagger', swaggerUi.serve, (req, res) => {
  let html = swaggerUi.generateHTML(swaggerDocs.swaggerDocs);
  res.send(html);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/blogs', publicBlogRoutes);
app.use('/api/courses', publicCourseRoutes);
app.use('/api/users', publicUserRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Sales CRM API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app; 