import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deactivateAccount,
  refreshToken,
  logout,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Authentication routes (public)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// User profile routes (protected)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/profile/password', authenticateToken, updatePassword);
router.delete('/profile', authenticateToken, deactivateAccount);

export default router;
