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

export const fetchAdminBookings = createAsyncThunk(
  'bookings/fetchAdminBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/bookings');
      const rawBookings = response.data.data || [];
      return rawBookings.map((b) => {
        const checkInStr = b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : '';
        const checkOutStr = b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : '';
        const statusCap = b.bookingStatus 
          ? (b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1).toLowerCase())
          : 'Pending';

        return {
          id: b.bookingId || b._id,
          _id: b._id,
          bookingId: b.bookingId,
          propertyName: b.property?.name || 'Vacation Stay',
          propertyLocation: b.property?.location 
            ? `${b.property.location.city || ''}${b.property.location.state ? ', ' + b.property.location.state : ''}` 
            : 'Indore, Madhya Pradesh',
          propertyImage: b.property?.images?.[0] || 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
          userName: b.guestDetails?.name || b.customer?.name || 'Guest',
          userEmail: b.guestDetails?.email || b.customer?.email || '',
          userMobile: b.guestDetails?.mobile || b.customer?.mobile || '',
          checkIn: checkInStr,
          checkOut: checkOutStr,
          nights: b.numberOfNights || 1,
          pricePerNight: b.pricePerNight || 0,
          cleaningFee: 0,
          serviceFee: b.serviceFee || 0,
          totalAmount: b.totalAmount || 0,
          paymentStatus: b.paymentStatus === 'paid' ? 'Paid' : (b.paymentStatus || 'Pending'),
          status: statusCap,
          rawStatus: b.bookingStatus,
          createdAt: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '',
        };
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin bookings');
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
        const idx = state.bookings.findIndex(b => b._id === action.payload._id || b.bookingId === action.payload.bookingId || b.id === action.payload.bookingId || b.id === action.payload._id);
        if (idx !== -1) {
          const statusCap = action.payload.bookingStatus
            ? (action.payload.bookingStatus.charAt(0).toUpperCase() + action.payload.bookingStatus.slice(1).toLowerCase())
            : state.bookings[idx].status;
          state.bookings[idx] = {
            ...state.bookings[idx],
            ...action.payload,
            status: statusCap,
          };
        }
      })
      // Fetch Admin Bookings
      .addCase(fetchAdminBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAdminBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setPendingBooking, clearConfirmedBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
