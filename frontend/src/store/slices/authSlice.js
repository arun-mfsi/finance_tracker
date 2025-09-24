import { createSlice } from '@reduxjs/toolkit';

// Helper function to get tokens from localStorage
const getTokensFromStorage = () => {
  try {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};

// Helper function to save tokens to localStorage
const saveTokensToStorage = (accessToken, refreshToken) => {
  try {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('Failed to save tokens to localStorage:', error);
  }
};

// Helper function to clear tokens from localStorage
const clearTokensFromStorage = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Failed to clear tokens from localStorage:', error);
  }
};

const { accessToken: storedAccessToken, refreshToken: storedRefreshToken } =
  getTokensFromStorage();

const initialState = {
  user: null,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!storedAccessToken,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set initialized state
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },

    // Login success
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Save to localStorage
      saveTokensToStorage(accessToken, refreshToken);
    },

    // Login failure
    loginFailure: (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;

      // Clear localStorage
      clearTokensFromStorage();
    },

    // Register success (same as login success)
    registerSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Save to localStorage
      saveTokensToStorage(accessToken, refreshToken);
    },

    // Register failure
    registerFailure: (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;

      // Clear localStorage
      clearTokensFromStorage();
    },

    // Logout
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Clear localStorage
      clearTokensFromStorage();
    },

    // Clear error
    clearError: state => {
      state.error = null;
    },

    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Token refresh success
    refreshTokenSuccess: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }

      // Save to localStorage
      saveTokensToStorage(accessToken, refreshToken || state.refreshToken);
    },

    // Token refresh failure
    refreshTokenFailure: state => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = 'Session expired. Please login again.';

      // Clear localStorage
      clearTokensFromStorage();
    },
  },
});

export const {
  setLoading,
  setInitialized,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  updateUserProfile,
  refreshTokenSuccess,
  refreshTokenFailure,
} = authSlice.actions;

// Selectors
export const selectAuth = state => state.auth;
export const selectUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectIsLoading = state => state.auth.isLoading;
export const selectError = state => state.auth.error;
export const selectAccessToken = state => state.auth.accessToken;
export const selectIsInitialized = state => state.auth.isInitialized;

export default authSlice.reducer;
