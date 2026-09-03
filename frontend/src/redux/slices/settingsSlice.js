import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPortalSettings = createAsyncThunk(
  'settings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const savePortalSettings = createAsyncThunk(
  'settings/save',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings', settingsData);
      const data = response.data.data;
      try {
        localStorage.setItem('cozycave_portal_settings', JSON.stringify(data));
      } catch (e) {
        console.error(e);
      }
      return data;
    } catch (error) {
      console.warn('Settings backend sync issue, saving locally:', error);
      try {
        localStorage.setItem('cozycave_portal_settings', JSON.stringify(settingsData));
      } catch (e) {
        console.error(e);
      }
      return settingsData;
    }
  }
);

const cachedSettings = (() => {
  try {
    const raw = localStorage.getItem('cozycave_portal_settings');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  portalName: cachedSettings?.portalName || 'The Cozy Cave',
  supportEmail: cachedSettings?.supportEmail || 'hello@thecozycave.com',
  supportPhone: cachedSettings?.supportPhone || '+1 (828) 555-0173',
  supportPhones: cachedSettings?.supportPhones || ['+1 (828) 555-0173', '+1 (828) 555-0174', '+1 (828) 555-0175'],
  whatsappLink: cachedSettings?.whatsappLink || 'https://wa.me/917999851384',
  serviceFeePercent: cachedSettings?.serviceFeePercent !== undefined ? cachedSettings.serviceFeePercent : 2,
  bookingWindowMonths: cachedSettings?.bookingWindowMonths !== undefined ? cachedSettings.bookingWindowMonths : 3,
  maintenanceMode: cachedSettings?.maintenanceMode || false,
  loading: false,
  error: null
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortalSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPortalSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.portalName = action.payload.portalName || state.portalName;
          state.supportEmail = action.payload.supportEmail || state.supportEmail;
          state.supportPhones = action.payload.supportPhones && action.payload.supportPhones.length > 0
            ? action.payload.supportPhones
            : (action.payload.supportPhone ? [action.payload.supportPhone] : state.supportPhones);
          state.supportPhone = state.supportPhones[0] || state.supportPhone;
          state.whatsappLink = action.payload.whatsappLink || state.whatsappLink;
          state.serviceFeePercent = action.payload.serviceFeePercent !== undefined ? action.payload.serviceFeePercent : state.serviceFeePercent;
          state.bookingWindowMonths = action.payload.bookingWindowMonths !== undefined ? action.payload.bookingWindowMonths : state.bookingWindowMonths;
          state.maintenanceMode = action.payload.maintenanceMode !== undefined ? action.payload.maintenanceMode : state.maintenanceMode;
        }
      })
      .addCase(fetchPortalSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePortalSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePortalSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.portalName = action.payload.portalName;
          state.supportEmail = action.payload.supportEmail;
          state.supportPhones = action.payload.supportPhones && action.payload.supportPhones.length > 0
            ? action.payload.supportPhones
            : (action.payload.supportPhone ? [action.payload.supportPhone] : state.supportPhones);
          state.supportPhone = state.supportPhones[0] || state.supportPhone;
          state.whatsappLink = action.payload.whatsappLink;
          state.serviceFeePercent = action.payload.serviceFeePercent;
          state.bookingWindowMonths = action.payload.bookingWindowMonths !== undefined ? action.payload.bookingWindowMonths : state.bookingWindowMonths;
          state.maintenanceMode = action.payload.maintenanceMode;
        }
      })
      .addCase(savePortalSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default settingsSlice.reducer;
