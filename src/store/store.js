import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import summarySlice from './slices/summarySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    summary: summarySlice,
  },
});

export default store;
