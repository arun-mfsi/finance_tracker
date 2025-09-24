import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Lazy load protected page components
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Loading component for protected routes
const ProtectedPageLoader = () => (
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
 * Protected routes component - contains all routes accessible when authenticated
 * These routes are automatically wrapped by ProtectedRoute guard
 */
const ProtectedRoutes = () => {
  console.log('ProtectedRoutes component rendering...');

  return (
    <Suspense fallback={<ProtectedPageLoader />}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        {/* Add more protected routes here as needed */}
        {/* <Route path="profile" element={<Profile />} /> */}
      </Routes>
    </Suspense>
  );
};

export default ProtectedRoutes;
