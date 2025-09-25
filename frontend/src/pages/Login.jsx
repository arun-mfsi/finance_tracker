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
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

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
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
        md={7}
        sx={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 'bold',
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 4,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
          }}
        >
          Sign in to your Finance Tracker account
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            maxWidth: { xs: 300, sm: 400, md: 500 },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.6,
          }}
        >
          Track your expenses, manage your budget, and achieve your financial
          goals with our comprehensive finance management platform.
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: '100vh',
          backgroundColor: { xs: '#f8f9fa', md: 'transparent' },
          width: { xs: '100%', md: '60%' },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '90%', sm: '60%', md: '80%', lg: '60%' },
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
            Sign In
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
            Welcome back to Finance Tracker
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
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
                  autoComplete="current-password"
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
                    onChange: handleInputChange,
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: { xs: 1.5, sm: 1.8 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 'bold',
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Don&apos;t have an account?{' '}
                    <Link
                      to="/register"
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
