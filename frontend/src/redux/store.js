import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice'; // <-- 1. IMPORT
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
