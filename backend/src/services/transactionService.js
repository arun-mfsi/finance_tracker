import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();

    return savedTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error(error.message || 'Failed to create transaction');
  }
};

/**
 * Get transactions for a user with filtering and pagination
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Transactions with pagination info
 */
export const getUserTransactions = async (userId, options = {}) => {
  try {
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
    } = options;

    // Build filter
    const filter = { user: userId };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(filter),
    ]);

    return {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Transaction
 */
export const getTransactionById = async (transactionId, userId) => {
  try {
    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction');
  }
};

/**
 * Update a transaction
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated transaction
 */
export const updateTransaction = async (transactionId, userId, updateData) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error(error.message || 'Failed to update transaction');
  }
};

/**
 * Delete a transaction
 * @param {string} transactionId - Transaction ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deleted transaction
 */
export const deleteTransaction = async (transactionId, userId) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
};

/**
 * Get user's financial summary
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Financial summary
 */
export const getUserFinancialSummary = async (userId, options = {}) => {
  try {
    const { startDate, endDate } = options;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.date.$lte = new Date(endDate);
      }
    }

    const pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ];

    const results = await Transaction.aggregate(pipeline);
    
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      transactionCount: 0,
    };

    results.forEach(result => {
      if (result._id === 'income') {
        summary.totalIncome = result.total;
      } else if (result._id === 'expense') {
        summary.totalExpenses = result.total;
      }
      summary.transactionCount += result.count;
    });

    summary.balance = summary.totalIncome - summary.totalExpenses;

    return summary;
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw new Error('Failed to fetch financial summary');
  }
};

/**
 * Get category breakdown analytics
 */
export const getCategoryBreakdownData = async (userId, options = {}) => {
  const { startDate, endDate, type } = options;

  // Build filter
  const filter = { user: userId };

  if (type) {
    filter.type = type;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  // Aggregate by category
  const breakdown = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$category',
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        category: '$_id',
        amount: 1,
        count: 1,
        _id: 0,
      },
    },
    { $sort: { amount: -1 } },
  ]);

  return breakdown;
};

/**
 * Get spending trends analytics
 */
export const getSpendingTrendsData = async (userId, options = {}) => {
  const { period = 'monthly', months = 6 } = options;

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Aggregate by month
  const trends = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        amount: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month',
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$amount', 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        period: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: 1,
          },
        },
        income: 1,
        expenses: 1,
        _id: 0,
      },
    },
    { $sort: { period: 1 } },
  ]);

  return trends;
};

/**
 * Get monthly summary analytics
 */
export const getMonthlySummaryData = async (userId, options = {}) => {
  const { months = 6 } = options;

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Aggregate by month
  const summary = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month',
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$amount', 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$amount', 0],
          },
        },
        incomeCount: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$count', 0],
          },
        },
        expenseCount: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$count', 0],
          },
        },
      },
    },
    {
      $project: {
        month: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: 1,
          },
        },
        income: 1,
        expenses: 1,
        incomeCount: 1,
        expenseCount: 1,
        net: { $subtract: ['$income', '$expenses'] },
        _id: 0,
      },
    },
    { $sort: { month: 1 } },
  ]);

  return summary;
};
