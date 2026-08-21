import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/favorites');
      return response.data.data; // Array of Favorite documents populated with property details
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const toggleFavoriteThunk = createAsyncThunk(
  'favorites/toggle',
  async (propertyId, { getState, rejectWithValue }) => {
    try {
      const { favorites } = getState().favorites;
      // check if favorite exists in local state
      const existingFav = favorites.find(fav => 
        (fav.property?._id === propertyId) || 
        (fav.property === propertyId)
      );

      if (existingFav) {
        await api.delete(`/favorites/${propertyId}`);
        return { propertyId, action: 'removed' };
      } else {
        const response = await api.post(`/favorites/${propertyId}`);
        return { favorite: response.data.data, action: 'added' };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update favorite');
    }
  }
);

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavoriteThunk.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.favorites = state.favorites.filter(fav => 
            (fav.property?._id !== action.payload.propertyId) && 
            (fav.property !== action.payload.propertyId)
          );
        } else if (action.payload.action === 'added') {
          state.favorites.push(action.payload.favorite);
        }
      });
  }
});

export default favoriteSlice.reducer;
