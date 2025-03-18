const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const users = await User.find(query, { password: 0 }) // Exclude password
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments(query);
    
    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return User.findById(id, { password: 0 }); // Exclude password
  }
  
  async findByUsername(username) {
    return User.findOne({ username });
  }
  
  async findByEmail(email) {
    return User.findOne({ email });
  }
  
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }
  
  async update(id, userData) {
    // Don't allow password updates through this method
    if (userData.password) {
      delete userData.password;
    }
    
    return User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
  }
  
  async updatePassword(id, newPassword) {
    const user = await User.findById(id);
    if (!user) return null;
    
    user.password = newPassword;
    return user.save();
  }
  
  async delete(id) {
    return User.findByIdAndDelete(id);
  }
  
  async authenticate(email, password) {
    const user = await User.findOne({ email });
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return { success: false, message: 'Password incorrect' };
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return {
      success: true,
      token,
      user: userResponse
    };
  }
}

module.exports = new UserRepository(); 