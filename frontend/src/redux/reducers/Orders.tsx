import { Order } from '@/models/newModel/order';
import { createSlice } from '@reduxjs/toolkit';

interface OrdersState {
  loading: boolean;
  value: Order[];
  currentOrder?: Order;
  currentPageList: Order[];
  currentPageNumber: number;
  pageSize: number;
  totalOrders: number;
  totalPages: number;
  error: string;
}

// Define the initial state using that type
const initialState: OrdersState = {
  loading: true,
  value: [],
  currentOrder: undefined,
  currentPageList: [],
  currentPageNumber: 0,
  pageSize: 10,
  totalOrders: 0,
  totalPages: 0,
  error: '',
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.value = action.payload;
      state.totalOrders = action.payload.length;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setCurrentPageNumber: (state, action) => {
      state.currentPageNumber = action.payload.pageNumber;
      state.totalPages = action.payload.totalPages;
    },
    setCurrentPageList: (state, action) => {
      state.currentPageList = action.payload;
    },
    error: (state, action) => {},
  },
});

export const { setOrders, setCurrentOrder, setCurrentPageList, setCurrentPageNumber, error } = ordersSlice.actions;
export default ordersSlice.reducer;
