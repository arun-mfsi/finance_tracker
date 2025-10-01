import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = getState().auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// Wrapper to add content-type for non-FormData requests
const baseQuery = async (args, api, extraOptions) => {
  // If body is FormData, don't set content-type (browser will set it with boundary)
  // Otherwise, set content-type to application/json
  if (typeof args !== 'string' && args.body && !(args.body instanceof FormData)) {
    args.headers = args.headers || new Headers();
    if (args.headers instanceof Headers) {
      args.headers.set('content-type', 'application/json');
    }
  }

  return customBaseQuery(args, api, extraOptions);
};

// Enhanced base query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: '/users/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new tokens
        api.dispatch({
          type: 'auth/refreshTokenSuccess',
          payload: refreshResult.data,
        });

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

// Create the base API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Transaction', 'FinancialSummary'],
  endpoints: () => ({}),
});

export default baseApi;
