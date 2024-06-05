import { createSlice } from "@reduxjs/toolkit"

interface CategoriesState {
    loading: boolean,
    value: Category[],
    currentCategory?: Category,
    currentPageList: Category[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    error: string
}

// Define the initial state using that type
const initialState: CategoriesState = {
    loading: true,
    value: [],
    currentCategory: undefined,
    currentPageList: [],
    currentPageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    error: ''
}

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        setCurrentPageNumber: (state, action) => {
            // state.currentPageList = action.payload
            state.currentPageNumber = action.payload;
        },
        setCurrentPageList: (state, action) => {
            state.currentPageList = action.payload;
        },
        error: (state, action) => {

        }
    },
});


export const { setCategories, setCurrentCategory, setCurrentPageList, error } = accountsSlice.actions;
export default accountsSlice.reducer