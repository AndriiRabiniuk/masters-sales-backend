const { User } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

/**
 * Get all users for the admin's company
 * @route GET /api/users
 * @access Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['name', 'email'] : [];
  
  // Company admins can only see users in their company
  const query = { company_id: req.user.company_id };
  
  // Add role filter if provided
  if (role) {
    query.role = role;
  }
  
  // Get paginated results
  const results = await paginateResults(User, query, {
    page,
    limit,
    search,
    searchFields,
    populate: 'company_id',
    sort: { name: 1 } // Sort alphabetically by name
  });
  
  // Rename data to users to match desired response format
  const { data: users, ...rest } = results;
  
  // Remove password field from response
  const sanitizedUsers = users.map(user => {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  });
  
  res.json({ users: sanitizedUsers, ...rest });
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('company_id', 'name');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Company admins can only access users from their company
  // if (req.user.role !== 'super_admin' && user.company_id.toString() !== req.user.company_id.toString()) {
  //   res.status(403);
  //   throw new Error('Not authorized to access this user');
  // }
  
  // Remove password field
  const userObj = user.toObject();
  delete userObj.password;
  
  res.json(userObj);
});

/**
 * Create a new user
 * @route POST /api/users
 * @access Private/Admin
 */
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user already exists
  const userExists = await User.findOne({ email });
  
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  // Company admins can't create admin or super_admin users
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id && (role === 'super_admin' || role === 'admin')) {
    res.status(403);
    throw new Error('Not authorized to create users with this role');
  }
  
  // Always set company_id from the admin's company
  const company_id = req.user.company_id;
  
  // Create the user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    company_id
  });
  
  if (user) {
    // Remove password field from response
    const userObj = user.toObject();
    delete userObj.password;
    
    res.status(201).json(userObj);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * Update a user
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, role, password } = req.body;
  
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Company admins can only update users from their company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id && user.company_id.toString() !== req.user.company_id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this user');
  }
  
  // Company admins can't change user to admin or super_admin
  if (req.user.role !== 'super_admin'  && req.user.role !== 'admin' && (role === 'super_admin' || role === 'admin')) {
    res.status(403);
    throw new Error('Not authorized to assign this role');
  }
  
 
  
  // Update user fields
  user.name = name || user.name;
  user.email = email || user.email;
  
  // Only update role if provided and authorized
  if (role) {
    user.role = role;
  }
  
  // Only update password if provided
  if (password) {
    user.password = password;
  }
  
  const updatedUser = await user.save();
  
  // Remove password field from response
  const userObj = updatedUser.toObject();
  delete userObj.password;
  
  res.json(userObj);
});

/**
 * Delete a user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Company admins can only delete users from their company
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id && user.company_id.toString() !== req.user.company_id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this user');
  }
  
  // Don't allow deleting own account
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }
  
  // Don't allow company admins to delete other admins
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && user.role === 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete an admin');
  }
  
  await user.deleteOne();
  
  res.json({ message: 'User deleted' });
}); 