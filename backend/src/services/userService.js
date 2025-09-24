import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Create a new user
export const createUser = async userData => {
  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    await user.save();

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

// Find user by email (for authentication)
export const findUserByEmail = async email => {
  return await User.findOne({ email }).select('+password');
};

// Find user by ID
export const findUserById = async userId => {
  return await User.findById(userId);
};

// Update user profile
export const updateUser = async (userId, updateData) => {
  // Remove password from update data if present
  // eslint-disable-next-line no-unused-vars
  const { password, ...safeUpdateData } = updateData;

  const user = await User.findByIdAndUpdate(userId, safeUpdateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Update password
export const updateUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

// Compare password for authentication
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch {
    throw new Error('Password comparison failed');
  }
};

// Update last login
export const updateLastLogin = async userId => {
  await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
};

// Get all active users (admin function)
export const getActiveUsers = async () => {
  return await User.find({ isActive: true });
};

// Deactivate user account
export const deactivateUser = async userId => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Get user profile with full name
export const getUserProfile = async userId => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Add virtual full name
  const userObject = user.toObject();
  userObject.fullName = `${user.firstName} ${user.lastName}`;

  return userObject;
};

// Check if email exists
export const emailExists = async email => {
  const user = await User.findOne({ email });
  return !!user;
};
