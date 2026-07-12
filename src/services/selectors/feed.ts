import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedData = createSelector(
  (state: RootState) => state.feed.orders,
  (state: RootState) => state.feed.total,
  (state: RootState) => state.feed.totalToday,
  (orders, total, totalToday) => ({
    orders,
    total,
    totalToday
  })
);
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
