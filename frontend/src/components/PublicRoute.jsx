import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

/**
 * PublicRoute component - prevents authenticated users from accessing public pages
 * Redirects authenticated users to dashboard or intended page
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  console.log('PublicRoute - Auth state:', {
    isAuthenticated,
    isLoading,
    isInitialized,
    pathname: location.pathname,
  });

  // Show loading while initializing auth state
  if (!isInitialized || isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    // Get the intended destination from location state, default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
