const User = require('../models/User');
const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (include password field for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate JWT token
    const token = authService.generateToken(user);

    // Return user data (without password) and token
    successResponse(res, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    successResponse(res, { user }, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };
