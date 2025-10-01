import { baseApi } from './baseApi';

// Transactions API slice - all transaction management related endpoints
export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all transactions for user
    getTransactions: builder.query({
      query: ({
        page = 1,
        limit = 10,
        type,
        category,
        startDate,
        endDate,
        search,
        sortBy = 'date',
        sortOrder = 'desc',
      } = {}) => ({
        url: '/transactions',
        params: {
          page,
          limit,
          ...(type && { type }),
          ...(category && { category }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(search && { search }),
          sortBy,
          sortOrder,
        },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => ({
        transactions: response.data || [],
        pagination: response.pagination || {},
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch transactions';
      },
    }),

    // Get transaction by ID
    getTransactionById: builder.query({
      query: (id) => `/transactions/${id}`,
      keepUnusedDataFor: 0,
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch transaction';
      },
    }),

    // Create new transaction
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: '/transactions',
        method: 'POST',
        body: transactionData,
      }),
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to create transaction';
      },
    }),

    // Update transaction
    updateTransaction: builder.mutation({
      query: ({ id, ...transactionData }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: transactionData,
      }),
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to update transaction';
      },
    }),

    // Delete transaction
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to delete transaction';
      },
    }),

    // Get financial summary
    getFinancialSummary: builder.query({
      query: ({ startDate, endDate } = {}) => ({
        url: '/transactions/summary',
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch financial summary';
      },
    }),

    // Get recent transactions
    getRecentTransactions: builder.query({
      query: ({ limit = 5 } = {}) => ({
        url: '/transactions',
        params: {
          page: 1,
          limit,
          sortBy: 'date',
          sortOrder: 'desc',
        },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => response.data || [],
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch recent transactions';
      },
    }),

    // Get monthly transactions
    getMonthlyTransactions: builder.query({
      query: ({ year, month } = {}) => {
        const now = new Date();
        const currentYear = year || now.getFullYear();
        const currentMonth = month !== undefined ? month : now.getMonth();
        
        const startDate = new Date(currentYear, currentMonth, 1).toISOString();
        const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString();

        return {
          url: '/transactions',
          params: {
            startDate,
            endDate,
            page: 1,
            limit: 1000,
            sortBy: 'date',
            sortOrder: 'desc',
          },
        };
      },
      providesTags: ['Transaction'],
      transformResponse: (response) => response.data || [],
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch monthly transactions';
      },
    }),

    // Get category breakdown analytics
    getCategoryBreakdown: builder.query({
      query: ({ startDate, endDate, type } = {}) => ({
        url: '/transactions/analytics/category-breakdown',
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(type && { type }),
        },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => response.data || [],
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch category breakdown';
      },
    }),

    // Get spending trends over time
    getSpendingTrends: builder.query({
      query: ({ period = 'monthly', months = 6 } = {}) => ({
        url: '/transactions/analytics/spending-trends',
        params: {
          period,
          months,
        },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => response.data || [],
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch spending trends';
      },
    }),

    // Get monthly summary for multiple months
    getMonthlySummary: builder.query({
      query: ({ months = 6 } = {}) => ({
        url: '/transactions/analytics/monthly-summary',
        params: {
          months,
        },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => response.data || [],
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch monthly summary';
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetFinancialSummaryQuery,
  useGetRecentTransactionsQuery,
  useGetMonthlyTransactionsQuery,
  useGetCategoryBreakdownQuery,
  useGetSpendingTrendsQuery,
  useGetMonthlySummaryQuery,
} = transactionsApi;
