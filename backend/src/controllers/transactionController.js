import {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getUserFinancialSummary,
  getCategoryBreakdownData,
  getSpendingTrendsData,
  getMonthlySummaryData,
} from '../services/transactionService.js';
import logger from '../config/logger.js';

/**
 * Create a new transaction
 */
export const createTransactionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, type, description, date, category, tags, notes } = req.body;

    logger.info('Creating transaction', { userId, type, amount, category, description });

    // Validate required fields
    if (!amount || !type || !description || !category) {
      logger.warn('Transaction creation failed - missing required fields', { userId });
      return res.status(400).json({
        success: false,
        message: 'Amount, type, description, and category are required',
      });
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      logger.warn('Transaction creation failed - invalid type', { userId, type });
      return res.status(400).json({
        success: false,
        message: 'Type must be either income or expense',
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      logger.warn('Transaction creation failed - invalid amount', { userId, amount });
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const transactionData = {
      amount: parseFloat(amount),
      type,
      description,
      date: date ? new Date(date) : new Date(),
      category,
      user: userId,
      tags,
      notes,
    };

    const transaction = await createTransaction(transactionData);

    logger.logUserActivity(userId, 'create_transaction', {
      transactionId: transaction._id,
      type,
      amount: transaction.amount,
      category,
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    logger.error('Transaction creation error', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });

    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (error.message === 'Transaction type must match category type') {
      return res.status(400).json({
        success: false,
        message: 'Transaction type must match category type',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message,
    });
  }
};

/**
 * Get transactions for the authenticated user
 */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    logger.info('Fetching transactions', {
      userId,
      page,
      limit,
      filters: { type, category, startDate, endDate, search },
    });

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy,
      sortOrder,
    };

    const result = await getUserTransactions(userId, options);

    logger.debug('Transactions fetched successfully', {
      userId,
      count: result.transactions.length,
      total: result.pagination.total,
    });

    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error('Failed to fetch transactions', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
};

/**
 * Get a specific transaction by ID
 */
export const getTransactionByIdController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await getTransactionById(id, userId);

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
};

/**
 * Update a transaction
 */
export const updateTransactionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    // Remove user field from update data
    delete updateData.user;

    // Validate amount if provided
    if (updateData.amount !== undefined) {
      if (isNaN(updateData.amount) || updateData.amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
      updateData.amount = parseFloat(updateData.amount);
    }

    // Validate type if provided
    if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either income or expense',
      });
    }

    // Convert date if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const transaction = await updateTransaction(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (error.message === 'Transaction type must match category type') {
      return res.status(400).json({
        success: false,
        message: 'Transaction type must match category type',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message,
    });
  }
};

/**
 * Delete a transaction
 */
export const deleteTransactionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await deleteTransaction(id, userId);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: transaction,
    });
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message,
    });
  }
};

/**
 * Get financial summary for the authenticated user
 */
export const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const options = {
      startDate,
      endDate,
    };

    const summary = await getUserFinancialSummary(userId, options);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial summary',
      error: error.message,
    });
  }
};

/**
 * Get category breakdown analytics
 */
export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, type } = req.query;

    const breakdown = await getCategoryBreakdownData(userId, {
      startDate,
      endDate,
      type,
    });

    res.status(200).json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category breakdown',
      error: error.message,
    });
  }
};

/**
 * Get spending trends analytics
 */
export const getSpendingTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'monthly', months = 6 } = req.query;

    const trends = await getSpendingTrendsData(userId, {
      period,
      months: parseInt(months),
    });

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spending trends',
      error: error.message,
    });
  }
};

/**
 * Get monthly summary analytics
 */
export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const summary = await getMonthlySummaryData(userId, {
      months: parseInt(months),
    });

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly summary',
      error: error.message,
    });
  }
};
