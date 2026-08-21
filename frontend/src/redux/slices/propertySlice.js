import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const mapProperty = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    price: p.pricePerNight || p.price,
    capacity: p.maxGuests || p.capacity,
    address: p.location?.address || p.address,
    city: p.location?.city || p.city,
    state: p.location?.state || p.state,
    googleMapUrl: p.location?.googleMapUrl || p.googleMapUrl || '',
    blockedDates: p.blockedDates || [],
  };
};

const mapFrontendToBackend = (data) => {
  if (!data) return {};
  return {
    name: data.name,
    description: data.description,
    images: data.images,
    pricePerNight: parseInt(data.pricePerNight || data.price) || 100,
    maxGuests: parseInt(data.maxGuests || data.capacity) || 2,
    bedrooms: parseInt(data.bedrooms) || 1,
    beds: parseInt(data.beds) || 1,
    bathrooms: parseFloat(data.bathrooms) || 1,
    amenities: data.amenities || [],
    houseRules: data.houseRules || [],
    checkInTime: data.checkInTime || '03:00 PM',
    checkOutTime: data.checkOutTime || '11:00 AM',
    cancellationPolicy: data.cancellationPolicy || 'Flexible cancellation.',
    tag: data.tag || 'Popular',
    location: data.location ? { ...data.location, googleMapUrl: data.googleMapUrl || data.location.googleMapUrl || '' } : {
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || 'India',
      pincode: data.pincode || '',
      latitude: data.latitude || 22.7196,
      longitude: data.longitude || 75.8577,
      googleMapUrl: data.googleMapUrl || ''
    }
  };
};

// Async Thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.guests) queryParams.append('guests', filters.guests);
        if (filters.priceRange) {
          queryParams.append('minPrice', filters.priceRange[0]);
          queryParams.append('maxPrice', filters.priceRange[1]);
        }
        if (filters.amenities && filters.amenities.length > 0) {
          queryParams.append('amenities', filters.amenities.join(','));
        }
        if (filters.sortBy) queryParams.append('sort', filters.sortBy);
      }
      const response = await api.get(`/properties?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property details');
    }
  }
);

export const adminAddProperty = createAsyncThunk(
  'properties/adminAdd',
  async (propertyData, { rejectWithValue }) => {
    try {
      const backendData = mapFrontendToBackend(propertyData);
      const response = await api.post('/properties', backendData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create property');
    }
  }
);

export const adminUpdateProperty = createAsyncThunk(
  'properties/adminUpdate',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...propertyData } = payload;
      const actualData = payload.propertyData || propertyData;
      const actualId = id || payload.id;
      const backendData = mapFrontendToBackend(actualData);
      const response = await api.put(`/properties/${actualId}`, backendData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update property');
    }
  }
);

export const adminDeleteProperty = createAsyncThunk(
  'properties/adminDelete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/properties/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete property');
    }
  }
);

export const adminTogglePropertyStatus = createAsyncThunk(
  'properties/adminToggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/properties/${id}/status`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

export const blockPropertyDates = createAsyncThunk(
  'properties/blockDates',
  async ({ propertyId, dates, reason }, { rejectWithValue }) => {
    try {
      await api.post('/availability/block', { propertyId, dates, reason });
      return { propertyId, dates };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block dates');
    }
  }
);

export const unblockPropertyDates = createAsyncThunk(
  'properties/unblockDates',
  async ({ propertyId, date }, { rejectWithValue }) => {
    try {
      await api.delete('/availability/block', { data: { propertyId, date } });
      return { propertyId, date };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unblock date');
    }
  }
);

// Backward compatibility exports for existing components
export const addProperty = adminAddProperty;
export const editProperty = adminUpdateProperty;
export const deleteProperty = adminDeleteProperty;
export const togglePropertyStatus = adminTogglePropertyStatus;

const initialState = {
  properties: [],
  filteredProperties: [],
  selectedProperty: null,
  searchParams: {
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
  },
  filters: {
    location: '',
    priceRange: [0, 1000],
    guests: 1,
    amenities: [],
    sortBy: 'rating-desc',
  },
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSelectedProperty: (state, action) => {
      state.selectedProperty = state.properties.find(p => p.id === action.payload || p._id === action.payload) || null;
    },
    updateSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        const mapped = (action.payload || []).map(mapProperty);
        state.properties = mapped;
        state.filteredProperties = mapped;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single details
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = mapProperty(action.payload);
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Add
      .addCase(adminAddProperty.fulfilled, (state, action) => {
        const mapped = mapProperty(action.payload);
        state.properties.push(mapped);
        state.filteredProperties.push(mapped);
      })
      // Admin Update
      .addCase(adminUpdateProperty.fulfilled, (state, action) => {
        const mapped = mapProperty(action.payload);
        const idx = state.properties.findIndex(p => p._id === mapped._id || p.id === mapped.id);
        if (idx !== -1) {
          state.properties[idx] = mapped;
        }
        const filteredIdx = state.filteredProperties.findIndex(p => p._id === mapped._id || p.id === mapped.id);
        if (filteredIdx !== -1) {
          state.filteredProperties[filteredIdx] = mapped;
        }
      })
      // Admin Delete
      .addCase(adminDeleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(p => p._id !== action.payload.id && p.id !== action.payload.id);
        state.filteredProperties = state.filteredProperties.filter(p => p._id !== action.payload.id && p.id !== action.payload.id);
      })
      // Admin Toggle Status
      .addCase(adminTogglePropertyStatus.fulfilled, (state, action) => {
        const mapped = mapProperty(action.payload);
        const idx = state.properties.findIndex(p => p._id === mapped._id || p.id === mapped.id);
        if (idx !== -1) {
          state.properties[idx].isActive = mapped.isActive;
        }
        const filteredIdx = state.filteredProperties.findIndex(p => p._id === mapped._id || p.id === mapped.id);
        if (filteredIdx !== -1) {
          state.filteredProperties[filteredIdx].isActive = mapped.isActive;
        }
      })
      // Block Calendar dates
      .addCase(blockPropertyDates.fulfilled, (state, action) => {
        const { propertyId, dates } = action.payload;
        if (state.selectedProperty && (state.selectedProperty._id === propertyId || state.selectedProperty.id === propertyId)) {
          if (!state.selectedProperty.blockedDates) state.selectedProperty.blockedDates = [];
          state.selectedProperty.blockedDates.push(...dates);
        }
        const idx = state.properties.findIndex(p => p._id === propertyId || p.id === propertyId);
        if (idx !== -1) {
          if (!state.properties[idx].blockedDates) state.properties[idx].blockedDates = [];
          state.properties[idx].blockedDates.push(...dates);
        }
      })
      // Unblock Calendar dates
      .addCase(unblockPropertyDates.fulfilled, (state, action) => {
        const { propertyId, date } = action.payload;
        if (state.selectedProperty && (state.selectedProperty._id === propertyId || state.selectedProperty.id === propertyId)) {
          if (state.selectedProperty.blockedDates) {
            state.selectedProperty.blockedDates = state.selectedProperty.blockedDates.filter(d => d !== date);
          }
        }
        const idx = state.properties.findIndex(p => p._id === propertyId || p.id === propertyId);
        if (idx !== -1) {
          if (state.properties[idx].blockedDates) {
            state.properties[idx].blockedDates = state.properties[idx].blockedDates.filter(d => d !== date);
          }
        }
      });
  }
});

export const {
  setSelectedProperty,
  updateSearchParams,
  updateFilters
} = propertySlice.actions;

export default propertySlice.reducer;
