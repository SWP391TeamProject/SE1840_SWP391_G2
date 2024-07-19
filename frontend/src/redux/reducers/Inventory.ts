import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '@/models/Item';
import { Page } from '@/models/Page';

interface InventoryState {
  loading: boolean;
  value: Item[];
  currentPageList: Item[];
  currentPageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  error: string;
}

const initialState: InventoryState = {
  loading: true,
  value: [],
  currentPageList: [],
  currentPageNumber: 0,
  pageSize: 50,
  totalItems: 0,
  totalPages: 0,
  error: '',
};

export const inventorySlice = createSlice({
  name: 'inventories',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Page<Item>>) => {
      state.value = action.payload.content;
      state.totalItems = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.currentPageList = action.payload.content;
      state.currentPageNumber = action.payload.pageable.pageNumber;
      state.pageSize = action.payload.pageable.pageSize;
      state.loading = false;
    },
    setCurrentPageNumber: (state, action) => {
      state.currentPageNumber = action.payload.pageNumber;
      state.totalPages = action.payload.totalPages;
    },
    setCurrentPageList: (state, action: PayloadAction<Item[]>) => {
      state.currentPageList = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setItems, setCurrentPageNumber, setCurrentPageList, setLoading, setError } = inventorySlice.actions;

export default inventorySlice.reducer;
