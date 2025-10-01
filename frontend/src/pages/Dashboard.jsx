import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add, TrendingUp, TrendingDown, AccountBalance, Edit, Delete, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


import { useAuth } from '../hooks/useAuth';
import TransactionModal from '../components/transactions/TransactionModal';
import { useGetFinancialSummaryQuery, useGetRecentTransactionsQuery } from '../store/api';
import { getCategoryName } from '../constants/categories';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';


const Dashboard = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalMode, setTransactionModalMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionMenuAnchor, setTransactionMenuAnchor] = useState(null);
  const [menuTransaction, setMenuTransaction] = useState(null);

  const { data: financialSummary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useGetFinancialSummaryQuery();
  const { data: recentTransactions, isLoading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useGetRecentTransactionsQuery({ limit: 5 });

  const refreshDashboardData = () => {
    refetchSummary();
    refetchTransactions();
  };

  const handleOpenTransactionModal = (mode = 'add', transaction = null) => {
    setTransactionModalMode(mode);
    setSelectedTransaction(transaction);
    setTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleTransactionMenu = (event, transaction) => {
    event.stopPropagation();
    setTransactionMenuAnchor(event.currentTarget);
    setMenuTransaction(transaction);
  };

  const handleCloseTransactionMenu = () => {
    setTransactionMenuAnchor(null);
    setMenuTransaction(null);
  };

  const handleEditTransaction = () => {
    handleOpenTransactionModal('edit', menuTransaction);
    handleCloseTransactionMenu();
  };

  const handleDeleteTransaction = () => {
    handleOpenTransactionModal('delete', menuTransaction);
    handleCloseTransactionMenu();
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          animation: 'fadeIn 0.8s ease-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Box
          sx={{
            mb: 4,
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
              }}
            >
              Welcome back, {user?.firstName || user?.name}! 👋
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
              }}
            >
              Here's your financial overview
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{
                opacity: 0.9,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem'
              }}>
                💡 Tip: Check your analytics below for spending insights
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fit, minmax(250px, 1fr))',
              md: 'repeat(auto-fit, minmax(280px, 1fr))'
            },
            mb: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Current Balance
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                  }}
                >
                  ₹{summaryLoading ? '...' : (financialSummary?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <AccountBalance sx={{ fontSize: 48, opacity: 0.8 }} />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Your net worth today
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Total Income
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₹{summaryLoading ? '...' : (financialSummary?.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Money earned
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(255, 87, 34, 0.3)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(255, 87, 34, 0.4)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Total Expenses
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₹{summaryLoading ? '...' : (financialSummary?.totalExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <TrendingDown sx={{ fontSize: 48, opacity: 0.8 }} />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Money spent
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => handleOpenTransactionModal('add')}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              px: 6,
              py: 2.5,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
              fontSize: '1.2rem',
              minWidth: 250,
              '&:hover': {
                boxShadow: '0 16px 50px rgba(102, 126, 234, 0.5)',
                transform: 'translateY(-3px) scale(1.02)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Add New Transaction
          </Button>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              📊 Your Financial Insights
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Track your spending patterns and financial trends at a glance
            </Typography>
          </Box>

          {/* Show message if no data */}
          {(!financialSummary || (financialSummary.totalIncome === 0 && financialSummary.totalExpenses === 0)) ? (
            <Box sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              border: '2px dashed #e0e0e0'
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📊 No Financial Data Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start by adding some transactions to see your financial analytics here.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenTransactionModal('add')}
                sx={{ mr: 2 }}
              >
                Add Transaction
              </Button>
            </Box>
          ) : (
            <AnalyticsDashboard />
          )}
        </Box>

        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Recent Activity
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate('/dashboard/transactions')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
                px: 2,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              View All →
            </Button>
          </Box>
          {transactionsLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading transactions...
            </Typography>
          ) : recentTransactions && recentTransactions.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentTransactions.map((transaction, index) => (
                <Paper
                  key={transaction._id}
                  elevation={1}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease-in-out',
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{
                    display: { xs: 'block', sm: 'none' }
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 1.5,
                      gap: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: transaction.type === 'income'
                              ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                              : 'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            flexShrink: 0,
                          }}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                          ) : (
                            <TrendingDown sx={{ color: 'white', fontSize: 20 }} />
                          )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                              fontSize: '0.95rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 0.25
                            }}
                          >
                            {transaction.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                            sx={{ fontSize: '0.95rem', lineHeight: 1.2 }}
                          >
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(event) => handleTransactionMenu(event, transaction)}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            width: 32,
                            height: 32,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            },
                          }}
                        >
                          <MoreVert sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        minWidth: 0
                      }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: transaction.category?.color || '#1976d2',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {getCategoryName(transaction.category)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            textTransform: 'capitalize',
                            fontSize: '0.7rem',
                            backgroundColor: transaction.type === 'income' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontWeight: 500
                          }}
                        >
                          {transaction.type}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 3
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      flex: 1,
                      minWidth: 0
                    }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: transaction.type === 'income'
                            ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                            : 'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          flexShrink: 0,
                        }}
                      >
                        {transaction.type === 'income' ? (
                          <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                        ) : (
                          <TrendingDown sx={{ color: 'white', fontSize: 24 }} />
                        )}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            mb: 0.5,
                            fontSize: '1.125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {transaction.description}
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: transaction.category?.color || '#1976d2',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.875rem' }}
                          >
                            {getCategoryName(transaction.category)} • {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      flexShrink: 0
                    }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                          sx={{ mb: 0.5, fontSize: '1.125rem' }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            textTransform: 'capitalize',
                            fontSize: '0.75rem',
                            backgroundColor: transaction.type === 'income' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontWeight: 500,
                            display: 'inline-block'
                          }}
                        >
                          {transaction.type}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(event) => handleTransactionMenu(event, transaction)}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: 3,
                border: '1px dashed rgba(102, 126, 234, 0.3)',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📝 No recent activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your recent transactions will appear here once you start adding them.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Use the "Add New Transaction" button above to get started!
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
            More Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard/transactions')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 2,
                borderRadius: 3,
                borderWidth: 2,
                fontSize: '1rem',
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Manage All Transactions
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                opacity: 0.6,
              }}
            >
              Export Reports (Coming Soon)
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                opacity: 0.6,
              }}
            >
              Budget Planning (Coming Soon)
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Transaction Action Menu */}
      <Menu
        anchorEl={transactionMenuAnchor}
        open={Boolean(transactionMenuAnchor)}
        onClose={handleCloseTransactionMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditTransaction}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteTransaction} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Transaction Modal */}
      <TransactionModal
        open={transactionModalOpen}
        onClose={handleCloseTransactionModal}
        mode={transactionModalMode}
        transaction={selectedTransaction}
        onSuccess={refreshDashboardData}
      />
    </>
  );
};

export default Dashboard;
