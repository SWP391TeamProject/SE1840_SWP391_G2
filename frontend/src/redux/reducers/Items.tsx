import { Item } from "@/models/Item";
import { createSlice } from "@reduxjs/toolkit"

interface ItemsState {
    loading: boolean,
    value: Item[],
    currentItem?: Item,
    currentPageList: Item[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    error: string
}

// Define the initial state using that type
const initialState: ItemsState = {
    loading: true,
    value: [],
    currentItem: undefined,
    currentPageList: [],
    currentPageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    error: ''
}

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentItem: (state, action) => {
            state.currentItem = action.payload;
        },
        setCurrentPageNumber: (state, action) => {
            state.currentPageNumber = action.payload.pageNumber;
            state.totalPages = action.payload.totalPages;
        },
        setCurrentPageList: (state, action) => {
            state.currentPageList = action.payload;
        },
        error: (state, action) => {

        }
    },
});


export const { setItems, setCurrentItem, setCurrentPageList, setCurrentPageNumber, error } = accountsSlice.actions;
export default accountsSlice.reducer