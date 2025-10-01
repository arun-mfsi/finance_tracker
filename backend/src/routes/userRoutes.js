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
  uploadProfileImage,
  deleteProfileImage,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', authLimiter, refreshToken);
router.post('/logout', logout);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/profile/password', authenticateToken, updatePassword);
router.delete('/profile', authenticateToken, deactivateAccount);

router.post('/profile/image', authenticateToken, uploadSingle, handleUploadError, uploadProfileImage);
router.delete('/profile/image', authenticateToken, deleteProfileImage);

export default router;
