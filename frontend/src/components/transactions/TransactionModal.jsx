import React, { useRef, useState } from 'react';
import { Alert } from '@mui/material';
import toast from 'react-hot-toast';
import ReusableModal from '../common/ReusableModal';
import TransactionForm from './TransactionForm';
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from '../../store/api';

/**
 * Transaction Modal Component
 * Handles add, edit, and delete operations for transactions
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.mode - Modal mode: 'add', 'edit', 'delete'
 * @param {Object} props.transaction - Transaction data for edit/delete modes
 * @param {function} props.onSuccess - Callback function called after successful operation
 */
const TransactionModal = ({
  open,
  onClose,
  mode = 'add',
  transaction = null,
  onSuccess,
}) => {
  const formRef = useRef();
  const [error, setError] = useState(null);

  // API mutations
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();

  const getModalTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add Transaction';
      case 'edit':
        return 'Edit Transaction';
      case 'delete':
        return 'Delete Transaction';
      default:
        return 'Transaction';
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError(null);

      if (mode === 'add') {
        await createTransaction(formData).unwrap();
        toast.success('Transaction added successfully!');
      } else if (mode === 'edit') {
        await updateTransaction({
          id: transaction._id,
          ...formData,
        }).unwrap();
        toast.success('Transaction updated successfully!');
      }

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Transaction operation failed:', error);
      const errorMessage = error?.data?.message || error?.message || 'An error occurred';
      toast.error(`Failed to ${mode === 'add' ? 'add' : 'update'} transaction: ${errorMessage}`);
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);

      await deleteTransaction(transaction._id).unwrap();
      toast.success('Transaction deleted successfully!');

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Delete transaction failed:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete transaction';
      toast.error(`Failed to delete transaction: ${errorMessage}`);
      setError(errorMessage);
    }
  };

  const handleModalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title={getModalTitle()}
      mode={mode}
      onSubmit={mode !== 'delete' ? handleModalSubmit : undefined}
      onConfirm={mode === 'delete' ? handleDelete : undefined}
      loading={isLoading}
      maxWidth="sm"
      fullWidth
    >
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {mode !== 'delete' && (
        <TransactionForm
          ref={formRef}
          initialData={transaction}
          onSubmit={handleSubmit}
          loading={isLoading}
          mode={mode}
        />
      )}
    </ReusableModal>
  );
};

export default TransactionModal;
