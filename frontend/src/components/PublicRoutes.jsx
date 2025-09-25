import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Lazy load public page components
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

// Loading component for public routes
const PublicPageLoader = () => (
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

/**
 * Public routes component - contains all routes accessible when not authenticated
 * These routes are automatically wrapped by PublicRoute guard
 */
const PublicRoutes = () => {
  console.log('PublicRoutes component rendering...');

  return (
    <Suspense fallback={<PublicPageLoader />}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* Add more public routes here as needed */}
        {/* <Route path="forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </Suspense>
  );
};

export default PublicRoutes;
