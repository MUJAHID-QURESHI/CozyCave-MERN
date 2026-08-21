import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/my');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const cancelBookingThunk = createAsyncThunk(
  'bookings/cancel',
  async ({ bookingId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

export const createPaymentOrder = createAsyncThunk(
  'bookings/createPaymentOrder',
  async ({ bookingId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/create-order', { bookingId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment order');
    }
  }
);

export const verifyPaymentSignature = createAsyncThunk(
  'bookings/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const adminDeleteBooking = createAsyncThunk(
  'bookings/adminDelete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/bookings/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete booking');
    }
  }
);

export const adminUpdateBookingStatus = createAsyncThunk(
  'bookings/adminUpdateStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}`, {
        bookingStatus: status.toLowerCase(),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
    }
  }
);

// Backward compatibility exports
export const deleteBooking = adminDeleteBooking;
export const updateBookingStatus = adminUpdateBookingStatus;

const initialState = {
  bookings: [],
  currentBooking: null, // used during checkout flow
  confirmedBooking: null, // last confirmed booking info
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setPendingBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearConfirmedBooking: (state) => {
      state.confirmedBooking = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Pending Booking
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmedBooking = action.payload;
        state.currentBooking = null;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b._id === action.payload._id || b.bookingId === action.payload.bookingId);
        if (idx !== -1) {
          state.bookings[idx] = action.payload;
        }
      })
      // Verify Payment
      .addCase(verifyPaymentSignature.fulfilled, (state, action) => {
        state.confirmedBooking = action.payload;
      })
      // Admin delete booking
      .addCase(adminDeleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(b => b._id !== action.payload.id && b.bookingId !== action.payload.id);
      })
      // Admin update booking status
      .addCase(adminUpdateBookingStatus.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b._id === action.payload._id || b.bookingId === action.payload.bookingId);
        if (idx !== -1) {
          state.bookings[idx] = action.payload;
        }
      });
  }
});

export const { setPendingBooking, clearConfirmedBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
