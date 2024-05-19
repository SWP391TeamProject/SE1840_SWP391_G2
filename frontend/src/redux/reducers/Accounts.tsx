import { Account } from "@/models/AccountModel";
import { createSlice } from "@reduxjs/toolkit"

interface AccountsState {
    loading: boolean,
    value: Account[]
    error: string
}

// Define the initial state using that type
const initialState: AccountsState = {
    loading: true,
    value: [],
    error: ''
}

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setAccounts: (state, action) => {
            state.value = action.payload;
        },
        error: (state, action) => {

        }
    },
});


export const { setAccounts, error } = accountsSlice.actions;
export default accountsSlice.reducer