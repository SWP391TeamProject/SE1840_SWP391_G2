import { Roles } from "@/constants/enums";
import { Payment } from "@/models/payment";
import { createSlice } from "@reduxjs/toolkit"

interface PaymentsState {
    loading: boolean,
    value: Payment[],
    currentPayment?: Payment,
    currentPageList: Payment[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    filter?: Roles,
    error: string
}

// Define the initial state using that type
const initialState: PaymentsState = {
    loading: true,
    value: [],
    currentPayment: undefined,
    currentPageList: [],
    currentPageNumber: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    error: ''
}

export const PaymentsSlice = createSlice({
    name: 'Payments',
    initialState,
    reducers: {
        setPayments: (state, action) => {
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentPayment: (state, action) => {
            state.currentPayment = action.payload;
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


export const { setPayments, setCurrentPayment, setCurrentPageList, setCurrentPageNumber, error } = PaymentsSlice.actions;
export default PaymentsSlice.reducer