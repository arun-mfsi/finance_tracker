import {
  createUser,
  emailExists,
  findUserByEmail,
  comparePassword,
  updateLastLogin,
  getUserProfile,
  updateUser,
  updateUserPassword,
  deactivateUser,
} from '../services/userService.js';
import User from '../models/User.js';
import { generateAuthTokens, verifyToken } from '../utils/jwt.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import logger from '../config/logger.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, currency } = req.body;

    logger.info('Registration attempt', { email, firstName, lastName, currency });

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !currency) {
      logger.warn('Registration failed - missing required fields', { email });
      return res.status(400).json({
        success: false,
        message:
          'Email, password, first name, last name, and preferred currency are required',
      });
    }

    // Check if email already exists
    const emailAlreadyExists = await emailExists(email);
    if (emailAlreadyExists) {
      logger.warn('Registration failed - email already exists', { email });
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const userObject = await createUser({
      email,
      password,
      firstName,
      lastName,
      currency,
    });

    // Generate JWT tokens (createUser returns plain object, so we need to create a user-like object for token generation)
    const { accessToken, refreshToken } = generateAuthTokens(userObject);

    // Store refresh token in user document by finding the user again
    await User.findByIdAndUpdate(userObject._id, {
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    // Ensure consistent ID field for frontend
    userObject.id = userObject._id;

    logger.logAuth('register', userObject._id, true, { email, firstName, lastName });
    logger.info('User registered successfully', { userId: userObject._id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userObject,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info('Login attempt', { email, ip: req.ip });

    // Validate required fields
    if (!email || !password) {
      logger.warn('Login failed - missing credentials', { email });
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      logger.warn('Login failed - user not found', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Login failed - account deactivated', { email, userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      logger.warn('Login failed - invalid password', { email, userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    await updateLastLogin(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Ensure consistent ID field for frontend
    userResponse.id = userResponse._id;

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateAuthTokens(user);

    // Store refresh token in user document
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    await user.save();

    logger.logAuth('login', user._id, true, { email, ip: req.ip });
    logger.info('User logged in successfully', { userId: user._id, email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error.message, stack: error.stack, email: req.body.email });
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove sensitive fields from update
    delete updateData.password;
    delete updateData.email;

    const user = await updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Update user password
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const result = await updateUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message,
    });
  }
};

// Deactivate user account
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await deactivateUser(userId);

    // Clear refresh token for the user
    user.refreshToken = null;
    user.refreshTokenExpiresAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
      data: user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account',
      error: error.message,
    });
  }
};

// Refresh access token using refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Find user with matching refresh token
    const user = await User.findOne({
      refreshToken,
      refreshTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Verify the refresh token
    try {
      verifyToken(refreshToken);
    } catch {
      // Clear invalid refresh token
      user.refreshToken = null;
      user.refreshTokenExpiresAt = null;
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      generateAuthTokens(user);

    // Store new refresh token
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message,
    });
  }
};

// Logout user and revoke refresh token
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Clear the refresh token from user
      await User.updateOne(
        { refreshToken },
        {
          refreshToken: null,
          refreshTokenExpiresAt: null,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const { url, publicId } = await uploadToCloudinary(base64Image);

    const user = await User.findById(userId);

    if (user.profileImage) {
      const urlParts = user.profileImage.split('/');
      const oldPublicId = urlParts.slice(-2).join('/').split('.')[0];
      try {
        await deleteFromCloudinary(oldPublicId);
      } catch (deleteError) {
        console.error('Error deleting old image:', deleteError);
      }
    }

    user.profileImage = url;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      profileImage: url,
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: error.message,
    });
  }
};

// Delete profile image
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user.profileImage) {
      return res.status(400).json({
        success: false,
        message: 'No profile image to delete',
      });
    }

    const urlParts = user.profileImage.split('/');
    const publicId = urlParts.slice(-2).join('/').split('.')[0];

    try {
      await deleteFromCloudinary(publicId);
    } catch (deleteError) {
      console.error('Error deleting from Cloudinary:', deleteError);
    }

    user.profileImage = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully',
    });
  } catch (error) {
    console.error('Profile image delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile image',
      error: error.message,
    });
  }
};
