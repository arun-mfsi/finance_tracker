import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // API slice
    [baseApi.reducerPath]: baseApi.reducer,

    // Regular slices
    auth: authSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});
