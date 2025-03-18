const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthService {
  async register(userData) {
    // Check if username already exists
    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }
    
    // Check if email already exists
    const existingEmail = await userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    
    // Create new user
    const user = await userRepository.create(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return {
      token,
      user: userResponse
    };
  }
  
  async login(email, password) {
    return userRepository.authenticate(email, password);
  }
  
  async getUserProfile(userId) {
    return userRepository.findById(userId);
  }
  
  async updateUserProfile(userId, userData) {
    // Check if username is being updated and if it already exists
    if (userData.username) {
      const existingUsername = await userRepository.findByUsername(userData.username);
      if (existingUsername && existingUsername._id.toString() !== userId) {
        throw new Error('Username already exists');
      }
    }
    
    // Check if email is being updated and if it already exists
    if (userData.email) {
      const existingEmail = await userRepository.findByEmail(userData.email);
      if (existingEmail && existingEmail._id.toString() !== userId) {
        throw new Error('Email already exists');
      }
    }
    
    return userRepository.update(userId, userData);
  }
  
  async changePassword(userId, currentPassword, newPassword) {
    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isMatch = await userRepository.authenticate(user.email, currentPassword);
    if (!isMatch.success) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    return userRepository.updatePassword(userId, newPassword);
  }
  
  async getAllUsers(query, options) {
    return userRepository.findAll(query, options);
  }
  
  async deleteUser(userId) {
    return userRepository.delete(userId);
  }
}

module.exports = new AuthService(); 