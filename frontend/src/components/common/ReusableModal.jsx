import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';

/**
 * Reusable Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.title - Modal title
 * @param {string} props.mode - Modal mode: 'add', 'edit', 'delete', 'view'
 * @param {React.ReactNode} props.children - Modal content
 * @param {function} props.onSubmit - Submit handler (for add/edit modes)
 * @param {function} props.onConfirm - Confirm handler (for delete mode)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Whether submit/confirm button is disabled
 * @param {string} props.submitText - Custom submit button text
 * @param {string} props.cancelText - Custom cancel button text
 * @param {string} props.maxWidth - Modal max width
 * @param {boolean} props.fullWidth - Whether modal should be full width
 * @param {boolean} props.showActions - Whether to show action buttons
 */
const ReusableModal = ({
  open,
  onClose,
  title,
  mode = 'add',
  children,
  onSubmit,
  onConfirm,
  loading = false,
  disabled = false,
  submitText,
  cancelText = 'Cancel',
  maxWidth = 'sm',
  fullWidth = true,
  showActions = true,
}) => {

  const getSubmitText = () => {
    if (submitText) return submitText;

    switch (mode) {
      case 'add':
        return 'Add';
      case 'edit':
        return 'Update';
      case 'delete':
        return 'Delete';
      case 'view':
        return 'Close';
      default:
        return 'Submit';
    }
  };

  const getLoadingText = () => {
    switch (mode) {
      case 'add':
        return 'Adding...';
      case 'edit':
        return 'Updating...';
      case 'delete':
        return 'Deleting...';
      default:
        return 'Saving...';
    }
  };

  const getSubmitColor = () => {
    switch (mode) {
      case 'delete':
        return 'error';
      case 'view':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const handleAction = () => {
    if (mode === 'delete' && onConfirm) {
      onConfirm();
    } else if ((mode === 'add' || mode === 'edit') && onSubmit) {
      onSubmit();
    } else if (mode === 'view') {
      onClose();
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ position: 'relative' }}>
          {mode === 'delete' ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this item?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone.
              </Typography>
            </Box>
          ) : (
            children
          )}

          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  {getLoadingText()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      {showActions && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={getSubmitColor()}
            disabled={disabled || loading}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
            sx={{
              minWidth: 100,
              ...(loading && {
                '& .MuiButton-startIcon': {
                  marginRight: 1,
                },
              }),
            }}
          >
            {loading ? getLoadingText() : getSubmitText()}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReusableModal;
