import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  mobileMenuOpen: false,
  adminSidebarOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const id = Date.now();
      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type || 'success', // 'success', 'error', 'info', 'warning'
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleAdminSidebar: (state) => {
      state.adminSidebarOpen = !state.adminSidebarOpen;
    },
    setAdminSidebarOpen: (state, action) => {
      state.adminSidebarOpen = action.payload;
    }
  }
});

export const {
  addToast,
  removeToast,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleAdminSidebar,
  setAdminSidebarOpen
} = uiSlice.actions;

export default uiSlice.reducer;
