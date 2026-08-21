import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import bookingReducer from './slices/bookingSlice';
import favoriteReducer from './slices/favoriteSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    bookings: bookingReducer,
    favorites: favoriteReducer,
    ui: uiReducer,
    settings: settingsReducer,
  },
});

export default store;
