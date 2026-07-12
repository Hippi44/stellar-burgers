import { RootState } from '../store';

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectSelectedOrder = (state: RootState) =>
  state.order.selectedOrder;
export const selectSelectedOrderLoading = (state: RootState) =>
  state.order.selectedOrderLoading;
