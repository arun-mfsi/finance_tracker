import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../config/routes';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';

/**
 * Centralized routing configuration
 * Separates public and protected routes with proper guards
 * Each route group handles its own lazy loading and suspense
 */
const AppRoutes = () => {
  console.log('AppRoutes component rendering...');

  const { isAuthenticated, isInitialized } = useAuth();

  console.log('Auth state:', { isAuthenticated, isInitialized });

  // Determine default redirect based on auth state
  const getDefaultRedirect = () => {
    if (!isInitialized) {
      return null;
    }
    return getDefaultRoute(isAuthenticated);
  };

  const defaultRedirect = getDefaultRedirect();

  // Don't render anything if not initialized
  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRedirect} replace />} />

      {/* Conditional routing based on authentication */}
      {!isAuthenticated ? (
        // Public routes - when not authenticated
        <Route
          path="/*"
          element={
            <PublicRoute>
              <PublicRoutes />
            </PublicRoute>
          }
        />
      ) : (
        // Protected routes - when authenticated
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedRoutes />
            </ProtectedRoute>
          }
        />
      )}
    </Routes>
  );
};

export default AppRoutes;
