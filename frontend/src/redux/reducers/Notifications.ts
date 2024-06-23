import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/models/Notification";
import { Page } from "@/models/Page";

// Define the state type
interface NotificationsState {
    loading: boolean;
    value: Notification[];
    currentPageList: Notification[];
    currentPageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    error: string;
}

// Define the initial state using that type
const initialState: NotificationsState = {
    loading: true,
    value: [],
    currentPageList: [],
    currentPageNumber: 0,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
    error: '',
};

// Create the notifications slice
export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Page<Notification>>) => {
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
        setCurrentPageList: (state, action: PayloadAction<Notification[]>) => {
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

// Export actions
export const {
    setNotifications,
    setCurrentPageNumber,
    setCurrentPageList,
    setLoading,
    setError,
} = notificationsSlice.actions;

// Export reducer
export default notificationsSlice.reducer;
