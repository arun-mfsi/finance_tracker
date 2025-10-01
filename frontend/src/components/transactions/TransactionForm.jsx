import { useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  FormHelperText,
} from '@mui/material';
import {
  AttachMoney,
  CalendarToday,
  Description,
  Category,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { getCategoriesByType } from '../../constants/categories';


const TransactionForm = forwardRef(({
  initialData = {},
  onSubmit,
  error = null,
  mode = 'add',
}, ref) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      amount: initialData?.amount || '',
      type: initialData?.type || 'expense',
      description: initialData?.description || '',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      category: initialData?.category || '',
    },
  });

  const watchedType = watch('type');

  // Get categories based on selected type
  const categories = getCategoriesByType(watchedType);



  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        amount: initialData?.amount || '',
        type: initialData?.type || 'expense',
        description: initialData?.description || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: initialData?.category || '',
      });
    }
  }, [initialData, mode, reset]);

  useEffect(() => {
    if (mode !== 'edit' || !initialData?.category) {
      setValue('category', '');
    }
  }, [watchedType, setValue, mode, initialData?.category]);



  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    onSubmit(formattedData);
  };

  useImperativeHandle(ref, () => ({
    requestSubmit: () => {
      handleSubmit(handleFormSubmit)();
    }
  }));



  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name="type"
          control={control}
          rules={{ required: 'Transaction type is required' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Type</InputLabel>
              <Select
                {...field}
                label="Type"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
              {errors.type && (
                <FormHelperText>{errors.type.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="category"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                {...field}
                label="Category"
                startAdornment={
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                }
              >
                {categories.map((category) => (
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
              {errors.category && (
                <FormHelperText>{errors.category.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="amount"
          control={control}
          rules={{
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Please enter a valid amount',
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount"
              type="number"
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                step: '0.01',
                min: '0.01',
              }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            required: 'Description is required',
            maxLength: { value: 200, message: 'Description cannot exceed 200 characters' },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: 'Date is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date"
              type="date"
              fullWidth
              error={!!errors.date}
              helperText={errors.date?.message}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />


      </Box>
    </Box>
  );
});

TransactionForm.displayName = 'TransactionForm';

export default TransactionForm;
