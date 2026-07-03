import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderHistoryState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderHistoryState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchOrderHistory = createAsyncThunk(
  'orderHistory/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load order history'
      );
    }
  }
);

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Failed to load order history';
      });
  }
});

export const orderHistoryReducer = orderHistorySlice.reducer;
