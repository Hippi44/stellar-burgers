import { RootState } from '../store';

export const selectOrderHistoryOrders = (state: RootState) =>
  state.orderHistory.orders;
