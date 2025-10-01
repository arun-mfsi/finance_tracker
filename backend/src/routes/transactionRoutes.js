import express from 'express';
import {
  createTransactionController,
  getTransactions,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
  getFinancialSummary,
  getCategoryBreakdown,
  getSpendingTrends,
  getMonthlySummary,
} from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All transaction routes require authentication
router.use(authenticateToken);

// GET /api/transactions/summary - Get financial summary
router.get('/summary', getFinancialSummary);

// Analytics routes
router.get('/analytics/category-breakdown', getCategoryBreakdown);
router.get('/analytics/spending-trends', getSpendingTrends);
router.get('/analytics/monthly-summary', getMonthlySummary);

// GET /api/transactions - Get all transactions for user
router.get('/', getTransactions);

// GET /api/transactions/:id - Get specific transaction
router.get('/:id', getTransactionByIdController);

// POST /api/transactions - Create new transaction
router.post('/', createTransactionController);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', updateTransactionController);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', deleteTransactionController);

export default router;
