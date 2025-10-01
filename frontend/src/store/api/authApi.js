import { baseApi } from './baseApi';

// Auth API slice - all authentication related endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Login user
    login: builder.mutation({
      query: credentials => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Login failed';
      },
    }),

    // Register user
    register: builder.mutation({
      query: userData => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Registration failed';
      },
    }),

    // Get current user profile
    getUserProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['Auth', 'User'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to fetch profile';
      },
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: userData => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to update profile';
      },
    }),

    // Change password
    changePassword: builder.mutation({
      query: passwordData => ({
        url: '/users/profile/password',
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to change password';
      },
    }),

    // Logout user
    logout: builder.mutation({
      query: (refreshToken) => ({
        url: '/users/logout',
        method: 'POST',
        body: { refreshToken },
      }),
      invalidatesTags: ['Auth'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Logout failed';
      },
    }),

    // Refresh token
    refreshToken: builder.mutation({
      query: refreshToken => ({
        url: '/users/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Token refresh failed';
      },
    }),

    // Forgot password
    forgotPassword: builder.mutation({
      query: email => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to send reset email';
      },
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to reset password';
      },
    }),

    // Verify email
    verifyEmail: builder.mutation({
      query: token => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['Auth'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Email verification failed';
      },
    }),

    // Upload profile image
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: '/users/profile/image',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth', 'User'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to upload profile image';
      },
    }),

    // Delete profile image
    deleteProfileImage: builder.mutation({
      query: () => ({
        url: '/users/profile/image',
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth', 'User'],
      transformResponse: response => response.data || response,
      transformErrorResponse: response => {
        return response.data?.message || 'Failed to delete profile image';
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
} = authApi;
