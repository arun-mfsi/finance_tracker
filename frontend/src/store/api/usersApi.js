import { baseApi } from './baseApi';

// Users API slice - all user management related endpoints
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin only)
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: '/users',
        params: { page, limit, search },
      }),
      providesTags: ['User'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch users';
      },
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch user';
      },
    }),

    // Update user (admin only)
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'User',
      ],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to update user';
      },
    }),

    // Delete user (admin only)
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        'User',
      ],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to delete user';
      },
    }),

    // Get user preferences
    getUserPreferences: builder.query({
      query: () => '/users/preferences',
      providesTags: ['User'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch preferences';
      },
    }),

    // Update user preferences
    updateUserPreferences: builder.mutation({
      query: (preferences) => ({
        url: '/users/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['User'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to update preferences';
      },
    }),

    // Get user statistics
    getUserStats: builder.query({
      query: (userId) => `/users/${userId}/stats`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch user stats';
      },
    }),

    // Upload user avatar
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User', 'Auth'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to upload avatar';
      },
    }),

    // Delete user avatar
    deleteAvatar: builder.mutation({
      query: () => ({
        url: '/users/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Auth'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to delete avatar';
      },
    }),

    // Get user activity log
    getUserActivity: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/users/activity',
        params: { page, limit },
      }),
      providesTags: ['User'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to fetch activity';
      },
    }),

    // Update user notification settings
    updateNotificationSettings: builder.mutation({
      query: (settings) => ({
        url: '/users/notifications',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['User'],
      transformResponse: (response) => response.data || response,
      transformErrorResponse: (response) => {
        return response.data?.message || 'Failed to update notification settings';
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useGetUserStatsQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useGetUserActivityQuery,
  useUpdateNotificationSettingsMutation,
} = usersApi;
