const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Generate JWT tokens
const generateTokens = (userId) => {
  // Access token (short-lived)
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Short expiry for security
  );

  // Refresh token (longer-lived)
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' } // Longer expiry for convenience
  );

  return { accessToken, refreshToken };
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, company_id } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // Will be hashed by the model pre-save hook
    role: role || 'user', // Default to user if not specified
    company_id
  });

  if (user) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token as HTTP-only cookie for security
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Return user info and access token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
      token: accessToken
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.comparePassword(password))) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
      user: user,
      token: accessToken
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public (with valid refresh token)
const refreshToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookie
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token not found');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    );

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: accessToken });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');
  
  res.json({ message: 'Logged out successfully' });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // Only update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      company_id: updatedUser.company_id
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  let query = {};
  
  // If admin, only get users from their company
  if (req.user.role === 'admin' && req.user.company_id) {
    query.company_id = req.user.company_id;
  }
  // Super admins can see all users
  
  const users = await User.find(query).select('-password');
  res.json(users);
});

// @desc    Delete user (admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if admin has permission to delete this user
  if (req.user.role === 'admin' && req.user.company_id) {
    if (user.company_id && user.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this user');
    }
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser
}; 