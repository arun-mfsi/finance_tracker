import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  AttachMoney,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
];

const Register = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    isLoading,
    error,
    isAuthenticated,
    clearError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      currency: '',
    },
  });

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts and unmounts
  useEffect(() => {
    clearError();

    return () => {
      clearError();
    };
  }, [clearError]);

  // Clear error when user starts typing
  const handleInputChange = () => {
    if (error) {
      clearError();
    }
  };

  const onSubmit = async data => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      console.error('Registration failed:', result.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid
        container
        sx={{
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          width: '100%',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Grid
          item
          xs={false}
          md={4}
          sx={{
            backgroundImage:
              'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: '100vh',
            width: { xs: 'none', md: '40%' },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              fontWeight: 'bold',
            }}
          >
            Join Finance Tracker
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            }}
          >
            Start your journey to financial freedom
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              maxWidth: { xs: 280, sm: 350, md: 400 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.6,
            }}
          >
            Create your account and begin tracking your expenses, setting
            budgets, and achieving your financial goals with our powerful tools.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: { xs: '#f8f9fa', md: 'transparent' },
            width: { xs: '100%', md: '60%' },
            padding: { xs: 2, md: 4 },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 2, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '80%', sm: '60%', md: '80%', lg: '60%' },
              borderRadius: { xs: 0, sm: 2 },
              boxShadow: { xs: 'none', sm: 3 },
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                textAlign: 'center',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Create your Finance Tracker account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ width: '100%' }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  flexDirection: 'column',
                }}
              >
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoComplete="given-name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'First name cannot exceed 50 characters',
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message:
                          'First name can only contain letters and spaces',
                      },
                    })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    autoComplete="family-name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Last name cannot exceed 50 characters',
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message:
                          'Last name can only contain letters and spaces',
                      },
                    })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                      onChange: handleInputChange,
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'Passwords do not match',
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="currency"
                    label="Preferred Currency"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                    {...register('currency', {
                      required: 'Please select your preferred currency',
                      validate: value =>
                        (value && value.trim() !== '') ||
                        'Please select a valid currency',
                    })}
                    error={!!errors.currency}
                    helperText={errors.currency?.message}
                  >
                    <MenuItem value="" disabled>
                      Select your preferred currency
                    </MenuItem>
                    {currencies.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      py: { xs: 1.5, sm: 1.8 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 'bold',
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
