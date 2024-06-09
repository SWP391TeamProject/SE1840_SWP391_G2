import Consignment from "@/models/consignment";
import { createSlice } from "@reduxjs/toolkit"

interface ConsignmentsState {
    loading: boolean,
    value: Consignment[],
    currentConsignment?: Consignment,
    currentPageList: Consignment[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    error: string
}

// Define the initial state using that type
const initialState: ConsignmentsState = {
    loading: true,
    value: [],
    currentConsignment: undefined,
    currentPageList: [],
    currentPageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    error: ''
}

export const consignmentsSlice = createSlice({
    name: 'consignments',
    initialState,
    reducers: {
        setConsignments: (state, action) => {
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentConsignment: (state, action) => {
            state.currentConsignment = action.payload;
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


export const { setConsignments, setCurrentConsignment, setCurrentPageList, setCurrentPageNumber, error } = consignmentsSlice.actions;
export default consignmentsSlice.reducer