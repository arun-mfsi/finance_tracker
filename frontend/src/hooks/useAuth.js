import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken,
  selectRefreshToken,
  selectIsInitialized,
  clearError,
  logout,
  setInitialized,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  refreshTokenSuccess,
  refreshTokenFailure,
} from '../store/slices/authSlice';
import { isTokenExpired, shouldRefreshToken } from '../utils/tokenUtils';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useRefreshTokenMutation,
} from '../store/api';

/**
 * Custom hook for authentication using RTK Query + Redux
 * Provides all auth-related state and actions
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);
  const isInitialized = useSelector(selectIsInitialized);

  // RTK Query mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Ref to prevent multiple simultaneous refresh attempts
  const refreshInProgress = useRef(false);

  // Get user profile query (only if authenticated)
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated || !accessToken,
  });

  // Initialize auth state on app load
  useEffect(() => {
    if (!isInitialized && !accessToken) {
      // No token, mark as initialized immediately
        dispatch(setInitialized(true));
    }
  }, [accessToken, user, isInitialized, isProfileLoading, dispatch]);

  useEffect(() => {
    if (profileData && accessToken && !user) {
      dispatch(
        loginSuccess({
          user: profileData,
          accessToken,
          refreshToken: accessToken,
        })
      );
      dispatch(setInitialized(true));
    }
  }, [profileData, accessToken, user, dispatch]);



  // Token refresh function
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || refreshInProgress.current) {
      return false;
    }

    try {
      refreshInProgress.current = true;
      const result = await refreshTokenMutation({ refreshToken }).unwrap();

      dispatch(refreshTokenSuccess({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch(refreshTokenFailure());
      return false;
    } finally {
      refreshInProgress.current = false;
    }
  }, [refreshToken, refreshTokenMutation, dispatch]);

  // Check token validity and refresh if needed
  const validateAndRefreshToken = useCallback(async () => {
    if (!accessToken) {
      return false;
    }

    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      return await refreshAccessToken();
    }

    // Check if token should be refreshed proactively
    if (shouldRefreshToken(accessToken)) {
      await refreshAccessToken();
    }

    return true;
  }, [accessToken, refreshAccessToken]);

  // Mark as initialized if profile fetch fails (invalid token)
  useEffect(() => {
    if (profileError && accessToken) {
      dispatch(logout());
      dispatch(setInitialized(true));
    }
  }, [profileError, accessToken, dispatch]);

  // Initialize authentication on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken && !isInitialized) {
        try {
          if (isTokenExpired(accessToken)) {
            dispatch(logout());
          }
        } catch (error) {
          dispatch(logout());
        }
        dispatch(setInitialized(true));
      } else if (!accessToken && !isInitialized) {
        dispatch(setInitialized(true));
      }
    };

    initializeAuth();
  }, [accessToken, isInitialized, dispatch]);

  // Login function
  const login = useCallback(
    async (email, password) => {
      try {
        const result = await loginMutation({ email, password }).unwrap();

        // Update Redux auth state with login data
        dispatch(
          loginSuccess({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );

        return { success: true, data: result };
      } catch (error) {
        const errorMessage = error.data?.message || error || 'Login failed';

        // Update Redux auth state with error
        dispatch(loginFailure(errorMessage));

        return { success: false, error: errorMessage };
      }
    },
    [loginMutation, dispatch]
  );

  // Register function
  const register = useCallback(
    async userData => {
      try {
        const result = await registerMutation(userData).unwrap();

        // Update Redux auth state with registration data
        dispatch(
          registerSuccess({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );

        return { success: true, data: result };
      } catch (error) {
        const errorMessage =
          error.data?.message || error || 'Registration failed';

        // Update Redux auth state with error
        dispatch(registerFailure(errorMessage));

        return { success: false, error: errorMessage };
      }
    },
    [registerMutation, dispatch]
  );

  // Logout function
  const logoutUserFunc = useCallback(async () => {
    // Clear local state immediately for better UX
    dispatch(logout());

    try {
      // Then attempt server logout (best effort)
      await logoutMutation(refreshToken).unwrap();
    } catch (error) {
       dispatch(logout()); // Manual logout as fallback   
    } 
  }, [logoutMutation, refreshToken, dispatch]);

  // Update user profile function
  const updateProfile = useCallback(
    async userData => {
      try {
        const result = await updateProfileMutation(userData).unwrap();
        return { success: true, data: result };
      } catch (error) {
        const errorMessage =
          error.data?.message || error || 'Failed to update profile';
        return { success: false, error: errorMessage };
      }
    },
    [updateProfileMutation]
  );

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading:
      isLoading || isLoginLoading || isRegisterLoading || isProfileLoading,
    error,
    accessToken,
    isInitialized,

    // Actions
    login,
    register,
    logout: logoutUserFunc,
    updateProfile,
    clearError: clearAuthError,
    validateAndRefreshToken,
    refreshAccessToken,

    // Additional state
    isLoginLoading,
    isRegisterLoading,
  };
};
