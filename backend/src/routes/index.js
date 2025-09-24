import express from 'express';
import userRoutes from './userRoutes.js';

const router = express.Router();

// API Routes
router.use('/users', userRoutes);

// Health check route
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
