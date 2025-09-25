// Central export file for all API slices
export { baseApi } from './baseApi';

// Auth API
export {
  authApi,
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
} from './authApi';

// Users API
export {
  usersApi,
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
} from './usersApi';
