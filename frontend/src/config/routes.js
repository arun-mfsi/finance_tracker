/**
 * Route configuration with metadata
 * Centralizes all route definitions and their properties
 */

// Route metadata
export const ROUTE_PATHS = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/dashboard/transactions',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Special routes
  HOME: '/',
  NOT_FOUND: '/404',
};

// Route configuration with access control
export const ROUTES_CONFIG = {
  // Public routes (accessible only when not authenticated)
  public: [
    {
      path: ROUTE_PATHS.LOGIN,
      title: 'Login',
      description: 'User login page',
    },
    {
      path: ROUTE_PATHS.REGISTER,
      title: 'Register',
      description: 'User registration page',
    },
    {
      path: ROUTE_PATHS.FORGOT_PASSWORD,
      title: 'Forgot Password',
      description: 'Password reset request page',
    },
    {
      path: ROUTE_PATHS.RESET_PASSWORD,
      title: 'Reset Password',
      description: 'Password reset page',
    },
  ],

  // Protected routes (accessible only when authenticated)
  protected: [
    {
      path: ROUTE_PATHS.DASHBOARD,
      title: 'Dashboard',
      description: 'Main dashboard page',
      isDefault: true, // Default page for authenticated users
    },
    {
      path: ROUTE_PATHS.TRANSACTIONS,
      title: 'Transactions',
      description: 'Transaction management',
    },
    {
      path: ROUTE_PATHS.PROFILE,
      title: 'Profile',
      description: 'User profile management',
    },
    {
      path: ROUTE_PATHS.SETTINGS,
      title: 'Settings',
      description: 'Application settings',
    },
  ],
};

// Helper functions
export const getDefaultRoute = isAuthenticated => {
  if (isAuthenticated) {
    const defaultRoute = ROUTES_CONFIG.protected.find(route => route.isDefault);
    return defaultRoute?.path || ROUTE_PATHS.DASHBOARD;
  }
  return ROUTE_PATHS.LOGIN;
};

export const isPublicRoute = pathname => {
  return ROUTES_CONFIG.public.some(route => route.path === pathname);
};

export const isProtectedRoute = pathname => {
  return ROUTES_CONFIG.protected.some(route => route.path === pathname);
};

export const getRouteTitle = pathname => {
  const allRoutes = [...ROUTES_CONFIG.public, ...ROUTES_CONFIG.protected];
  const route = allRoutes.find(route => route.path === pathname);
  return route?.title || 'Finance Tracker';
};
