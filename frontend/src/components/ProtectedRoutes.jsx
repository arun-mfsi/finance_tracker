import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AppLayout from './layout/AppLayout';

// Lazy load protected page components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Transactions = lazy(() => import('../pages/Transactions'));

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

  return (
    <Suspense fallback={<ProtectedPageLoader />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ProtectedRoutes;
