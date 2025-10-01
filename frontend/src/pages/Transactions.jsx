import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  MoreVert,
  CalendarToday,
} from '@mui/icons-material';
import { useGetTransactionsQuery } from '../store/api/transactionsApi';
import { getCategoryName, getCategoriesByType } from '../constants/categories';
import TransactionModal from '../components/transactions/TransactionModal';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

const Transactions = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const debouncedSearch = useDebounce(searchInput, 1500);

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalMode, setTransactionModalMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactionMenuAnchor, setTransactionMenuAnchor] = useState(null);
  const [menuTransaction, setMenuTransaction] = useState(null);

  const {
    data: transactionData,
    isLoading,
    error,
  } = useGetTransactionsQuery({
    page,
    limit,
    ...filters,
    search: debouncedSearch,
  });

  const transactions = transactionData?.transactions || [];
  const pagination = transactionData?.pagination || {};

  // Get categories based on selected type
  const availableCategories = filters.type ? getCategoriesByType(filters.type) : [];

  const handleFilterChange = (field, value) => {
    if (field === 'search') {
      setSearchInput(value);
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value,
        // Reset category when type changes
        ...(field === 'type' && { category: '' }),
      }));
    }
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
    });
    setPage(1);
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
   <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: 4
      }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            mb: { xs: 0, sm: 0 }
          }}
        >
          All Transactions
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => handleOpenTransactionModal('add')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2.5, sm: 3 },
            py: { xs: 1.25, sm: 1.5 },
            borderRadius: 2,
            boxShadow: 3,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            minWidth: { xs: 'auto', sm: 'auto' },
            alignSelf: { xs: 'flex-start', sm: 'auto' },
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Add Transaction
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FilterList />
          <Typography variant="h6">Filters</Typography>
          <Button size="small" onClick={handleClearFilters}>
            Clear All
          </Button>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <TextField
            label="Search"
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            helperText={
              searchInput && searchInput !== debouncedSearch
                ? "Searching..."
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchInput && searchInput !== debouncedSearch && (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <FormControl disabled={!filters.type}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {availableCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {(filters.type || filters.category || debouncedSearch || filters.startDate || filters.endDate) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.type && (
              <Chip
                label={`Type: ${filters.type}`}
                onDelete={() => handleFilterChange('type', '')}
                size="small"
              />
            )}
            {filters.category && (
              <Chip
                label={`Category: ${getCategoryName(filters.category)}`}
                onDelete={() => handleFilterChange('category', '')}
                size="small"
              />
            )}
            {debouncedSearch && (
              <Chip
                label={`Search: ${debouncedSearch}`}
                onDelete={() => handleFilterChange('search', '')}
                size="small"
              />
            )}
            {filters.startDate && (
              <Chip
                label={`From: ${filters.startDate}`}
                onDelete={() => handleFilterChange('startDate', '')}
                size="small"
              />
            )}
            {filters.endDate && (
              <Chip
                label={`To: ${filters.endDate}`}
                onDelete={() => handleFilterChange('endDate', '')}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {transactions.map((transaction) => (
                <Box
                  key={transaction._id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: transaction.category?.color || '#1976d2',
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {transaction.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getCategoryName(transaction.category)} • {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                    >
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(event) => handleTransactionMenu(event, transaction)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>

            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.pages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total || 0)} of {pagination.total || 0} transactions
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No transactions found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {(Object.values(filters).some(f => f) || debouncedSearch)
                ? 'Try adjusting your filters or add a new transaction.'
                : 'Start by adding your first transaction!'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenTransactionModal('add')}
            >
              Add Transaction
            </Button>
          </Box>
        )}
      </Paper>

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

      <TransactionModal
        open={transactionModalOpen}
        onClose={handleCloseTransactionModal}
        mode={transactionModalMode}
        transaction={selectedTransaction}
      />
    </Container>
  );
};

export default Transactions;
