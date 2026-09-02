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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save settings');
    }
  }
);

const initialState = {
  portalName: 'The Cozy Cave',
  supportEmail: 'hello@thecozycave.com',
  supportPhone: '+1 (828) 555-0173',
  supportPhones: ['+1 (828) 555-0173', '+1 (828) 555-0174', '+1 (828) 555-0175'],
  whatsappLink: 'https://wa.me/18285550173',
  taxPercent: 6,
  serviceFeePercent: 8,
  maintenanceMode: false,
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
          state.taxPercent = action.payload.taxPercent !== undefined ? action.payload.taxPercent : state.taxPercent;
          state.serviceFeePercent = action.payload.serviceFeePercent !== undefined ? action.payload.serviceFeePercent : state.serviceFeePercent;
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
          state.taxPercent = action.payload.taxPercent;
          state.serviceFeePercent = action.payload.serviceFeePercent;
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
