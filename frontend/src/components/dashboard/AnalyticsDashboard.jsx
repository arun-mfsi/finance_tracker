import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Category,
  Timeline,
  BarChart,
  Receipt,
} from '@mui/icons-material';
import {
  useGetFinancialSummaryQuery,
  useGetCategoryBreakdownQuery,
  useGetSpendingTrendsQuery,
  useGetMonthlySummaryQuery,
} from '../../store/api/transactionsApi';
import CategoryBreakdownChart from '../charts/CategoryBreakdownChart';
import SpendingTrendsChart from '../charts/SpendingTrendsChart';
import MonthlySummaryChart from '../charts/MonthlySummaryChart';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [categoryType, setCategoryType] = useState('expense');

  // Calculate date range based on selection
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const dateRange = getDateRange();

  // Fetch analytics data
  const { data: financialSummary, isLoading: summaryLoading } = useGetFinancialSummaryQuery(dateRange);
  const { data: categoryBreakdown, isLoading: categoryLoading } = useGetCategoryBreakdownQuery({
    ...dateRange,
    type: categoryType,
  });
  const { data: spendingTrends, isLoading: trendsLoading } = useGetSpendingTrendsQuery({
    months: timeRange === '1year' ? 12 : timeRange === '6months' ? 6 : 3,
  });
  const { data: monthlySummary, isLoading: monthlyLoading } = useGetMonthlySummaryQuery({
    months: timeRange === '1year' ? 12 : timeRange === '6months' ? 6 : 3,
  });

  // Debug: Log the financial summary data
  console.log('AnalyticsDashboard - Financial Summary:', {
    financialSummary,
    summaryLoading,
    dateRange,
    categoryBreakdown,
    spendingTrends,
    monthlySummary
  });

  // Calculate unique analytics metrics
  const totalIncome = financialSummary?.totalIncome || 0;
  const totalExpenses = financialSummary?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Calculate average transaction amounts
  const avgDailySpending = totalExpenses > 0 ? (totalExpenses / 30).toFixed(0) : 0;
  const transactionCount = (financialSummary?.transactionCount || 0);
  const avgTransactionSize = transactionCount > 0 ? (totalExpenses / transactionCount).toFixed(0) : 0;

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: { xs: 'center', md: 'stretch' },
      width: '100%',
      maxWidth: { xs: '100%', sm: '600px', md: '100%' },
      mx: { xs: 'auto', md: 0 },
    }}>
      {/* Minimalist Controls */}
      <Box sx={{
        display: 'flex',
        gap: 3,
        mb: 4,
        flexWrap: 'wrap',
        p: 3,
        width: '100%',
        justifyContent: { xs: 'center', md: 'flex-start' },
        backgroundColor: '#fafafa',
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ fontWeight: 500, color: '#666' }}>Time Period</InputLabel>
          <Select
            value={timeRange}
            label="Time Period"
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{
              borderRadius: 1,
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd',
              }
            }}
          >
            <MenuItem value="1month">Last Month</MenuItem>
            <MenuItem value="3months">Last 3 Months</MenuItem>
            <MenuItem value="6months">Last 6 Months</MenuItem>
            <MenuItem value="1year">Last Year</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ fontWeight: 500, color: '#666' }}>Category Type</InputLabel>
          <Select
            value={categoryType}
            label="Category Type"
            onChange={(e) => setCategoryType(e.target.value)}
            sx={{
              borderRadius: 1,
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd',
              }
            }}
          >
            <MenuItem value="expense">Expenses</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="#666" sx={{ fontWeight: 500 }}>
            Analyzing {timeRange === '1year' ? '12' : timeRange === '6months' ? '6' : timeRange === '3months' ? '3' : '1'} month(s) of data
          </Typography>
        </Box>
      </Box>

      {/* Premium Insights Cards */}
      <Grid
        container
        spacing={3}
        sx={{
          mb: 4,
          justifyContent: { xs: 'center', md: 'flex-start' },
          width: '100%'
        }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: 'white',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            borderRadius: 2,
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="#666" sx={{ mb: 1, fontWeight: 500 }}>
                    Savings Rate
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="700" color="#1a1a1a" sx={{ mb: 1 }}>
                    {savingsRate}%
                  </Typography>
                  <Chip
                    label={savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Improve'}
                    sx={{
                      backgroundColor: savingsRate >= 20 ? '#e8f5e8' : savingsRate >= 10 ? '#fff3e0' : '#ffebee',
                      color: savingsRate >= 20 ? '#2e7d32' : savingsRate >= 10 ? '#f57c00' : '#d32f2f',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                    }}
                    size="small"
                  />
                </Box>
                <BarChart sx={{ fontSize: 32, color: '#bdbdbd' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: 'white',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            borderRadius: 2,
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="#666" sx={{ mb: 1, fontWeight: 500 }}>
                    Daily Average
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="700" color="#1a1a1a" sx={{ mb: 1 }}>
                    ₹{avgDailySpending}
                  </Typography>
                  <Typography variant="caption" color="#999" sx={{ fontWeight: 500 }}>
                    Per day this period
                  </Typography>
                </Box>
                <Timeline sx={{ fontSize: 32, color: '#bdbdbd' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: 'white',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            borderRadius: 2,
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="#666" sx={{ mb: 1, fontWeight: 500 }}>
                    Avg Transaction
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="700" color="#1a1a1a" sx={{ mb: 1 }}>
                    ₹{avgTransactionSize}
                  </Typography>
                  <Typography variant="caption" color="#999" sx={{ fontWeight: 500 }}>
                    Per transaction
                  </Typography>
                </Box>
                <Category sx={{ fontSize: 32, color: '#bdbdbd' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: 'white',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            borderRadius: 2,
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="#666" sx={{ mb: 1, fontWeight: 500 }}>
                    Total Transactions
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="700" color="#1a1a1a" sx={{ mb: 1 }}>
                    {transactionCount}
                  </Typography>
                  <Typography variant="caption" color="#999" sx={{ fontWeight: 500 }}>
                    This period
                  </Typography>
                </Box>
                <Receipt sx={{ fontSize: 32, color: '#bdbdbd' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Clean Charts Section */}
      <Box sx={{ mb: 4, width: '100%' }}>
        <Typography
          variant="h5"
          fontWeight="600"
          color="#1a1a1a"
          gutterBottom
          sx={{
            mb: 3,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Analytics
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: { xs: 'center', md: 'flex-start' },
            width: '100%'
          }}
        >
          {/* Category Breakdown - Left Side */}
          <Grid item xs={12} lg={6}>
            <CategoryBreakdownChart
              data={categoryBreakdown}
              isLoading={categoryLoading}
              title={`${categoryType === 'expense' ? 'Expense Breakdown' : 'Income Sources'}`}
            />
          </Grid>

          {/* Spending Trends - Right Side */}
          <Grid item xs={12} lg={6}>
            <SpendingTrendsChart
              data={spendingTrends}
              isLoading={trendsLoading}
              title="Financial Trends"
            />
          </Grid>

          {/* Monthly Summary - Full Width Below */}
          <Grid item xs={12}>
            <MonthlySummaryChart
              data={monthlySummary}
              isLoading={monthlyLoading}
              title="Monthly Performance"
            />
          </Grid>
        </Grid>
      </Box>


    </Box>
  );
};

export default AnalyticsDashboard;
