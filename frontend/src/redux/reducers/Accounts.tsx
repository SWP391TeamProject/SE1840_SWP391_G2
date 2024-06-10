import { Roles } from "@/constants/enums";
import { Account } from "@/models/AccountModel";
import { createSlice } from "@reduxjs/toolkit"

interface AccountsState {
    loading: boolean,
    value: Account[],
    currentAccount?: Account,
    currentPageList: Account[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    filter?: Roles,
    error: string
}

// Define the initial state using that type
const initialState: AccountsState = {
    loading: true,
    value: [],
    currentAccount: undefined,
    currentPageList: [],
    currentPageNumber: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    error: ''
}

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setAccounts: (state, action) => {
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentAccount: (state, action) => {
            state.currentAccount = action.payload;
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


export const { setAccounts, setCurrentAccount, setCurrentPageList, setCurrentPageNumber, error } = accountsSlice.actions;
export default accountsSlice.reducer