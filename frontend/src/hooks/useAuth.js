import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken,
  selectIsInitialized,
  clearError,
  logout,
  setInitialized,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
} from '../store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
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
  const isInitialized = useSelector(selectIsInitialized);

  // RTK Query mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updateProfileMutation] = useUpdateProfileMutation();

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
    if (!isInitialized && accessToken) {
      // If we have a token but no user data, fetch profile
      if (!user && !isProfileLoading) {
        // Profile query will automatically run due to the skip condition
      }
    } else if (!accessToken) {
      // No token, mark as initialized
      dispatch(setInitialized(true));
    }
  }, [accessToken, user, isInitialized, isProfileLoading, dispatch]);

  // Update user data when profile is fetched
  useEffect(() => {
    if (profileData && accessToken && !user) {
      dispatch(
        loginSuccess({
          user: profileData,
          accessToken,
          refreshToken: accessToken, // Use accessToken as fallback
        })
      );
      dispatch(setInitialized(true));
    }
  }, [profileData, accessToken, user, dispatch]);

  // Mark as initialized if profile fetch fails (invalid token)
  useEffect(() => {
    if (profileError && accessToken) {
      dispatch(logout());
      dispatch(setInitialized(true));
    }
  }, [profileError, accessToken, dispatch]);

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
    try {
      await logoutMutation().unwrap();
      // Clear local state after successful server logout
      dispatch(logout());
    } catch (error) {
      // Even if server logout fails, we still clear local state
      console.error('Logout error:', error);
      dispatch(logout()); // Manual logout as fallback
    }
  }, [logoutMutation, dispatch]);

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

    // Additional state
    isLoginLoading,
    isRegisterLoading,
  };
};
