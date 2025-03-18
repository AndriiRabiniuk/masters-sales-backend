const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
require('dotenv').config();

// Import routes (to be implemented)
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const leadRoutes = require('./routes/leadRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const taskRoutes = require('./routes/taskRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Initialize Passport
app.use(passport.initialize());
require('./config/passport');

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);

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