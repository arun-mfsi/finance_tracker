import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security,
  Visibility,
  VisibilityOff,
  Lock,
  Key,
  Warning,
  Email,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation, useForgotPasswordMutation } from '../store/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm({
    mode: 'onBlur',
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm({
    mode: 'onBlur',
  });

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      toast.error(error?.message || 'Failed to change password');
    }
  };

  const onForgotPasswordSubmit = async (data) => {
    try {
      await forgotPassword(data.email).unwrap();
      toast.success('Password reset email sent! Check your inbox.');
      setForgotPasswordOpen(false);
      resetForgotForm();
    } catch (error) {
      toast.error(error?.message || 'Failed to send reset email');
    }
  };

  const newPassword = watchPassword('newPassword');

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: 'text.secondary' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score < 2) return { score, text: 'Weak', color: 'error.main' };
    if (score < 4) return { score, text: 'Fair', color: 'warning.main' };
    if (score < 5) return { score, text: 'Good', color: 'info.main' };
    return { score, text: 'Strong', color: 'success.main' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          Security Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account security and password settings
        </Typography>
      </Box>

      <Card elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
        <CardHeader
          avatar={<Security color="primary" />}
          title="Change Password"
          subheader="Update your account password for better security"
          sx={{ pb: 1 }}
        />
        <CardContent>
          <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Key />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                {newPassword && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color={passwordStrength.color}>
                      Password strength: {passwordStrength.text}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        height: 4,
                        backgroundColor: 'grey.200',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          height: '100%',
                          backgroundColor: passwordStrength.color,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Key />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isChangingPassword}
                startIcon={isChangingPassword ? <CircularProgress size={20} /> : <Security />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={1} sx={{ borderRadius: 3 }}>
        <CardHeader
          avatar={<Warning color="warning" />}
          title="Forgot Password?"
          subheader="Reset your password if you can't remember it"
          sx={{ pb: 1 }}
        />
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            If you've forgotten your password, you can request a password reset email.
            This will send a secure link to your registered email address.
            <br /><br />
            <strong>Note:</strong> Password reset functionality is currently under development.
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
              onClick={() => setForgotPasswordOpen(true)}
              startIcon={<Email />}
              disabled={true}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Send Reset Email (Coming Soon)
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Email color="primary" />
            Reset Password
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          
          <Box component="form" onSubmit={handleForgotSubmit(onForgotPasswordSubmit)}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...registerForgot('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!forgotErrors.email}
              helperText={forgotErrors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => {
              setForgotPasswordOpen(false);
              resetForgotForm();
            }}
            disabled={isSendingReset}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotSubmit(onForgotPasswordSubmit)}
            variant="contained"
            disabled={isSendingReset}
            startIcon={isSendingReset ? <CircularProgress size={20} /> : <Email />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
            }}
          >
            {isSendingReset ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
