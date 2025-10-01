import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AppLayout from './layout/AppLayout';
import { Box, CircularProgress, Typography } from '@mui/material';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));


const AppRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, isInitialized, validateAndRefreshToken } = useAuth();

  console.log('AppRoutes - Auth state:', {
    isAuthenticated,
    isInitialized,
    currentPath: location.pathname
  });

  const getDefaultRedirect = () => {
    if (!isInitialized) {
      return null;
    }
    // If authenticated, redirect to dashboard
    // If not authenticated, redirect to login
    return isAuthenticated ? '/dashboard' : '/login';
  };

  const defaultRedirect = getDefaultRedirect();

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Initializing application...
        </Typography>
      </Box>
    );
  }

  return (
    <Suspense fallback={
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
    }>
      <Routes>
        {/* Root redirect based on authentication */}
        <Route path="/" element={<Navigate to={defaultRedirect} replace />} />

        {/* Authentication-based routing */}
        {isAuthenticated ? (
          <>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/transactions" element={<Transactions />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard/transactions" element={<Navigate to="/login" replace />} />
            <Route path="/profile" element={<Navigate to="/login" replace />} />
            <Route path="/settings" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
