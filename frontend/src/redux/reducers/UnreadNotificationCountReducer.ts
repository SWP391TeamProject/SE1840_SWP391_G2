import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface NotificationState {
    count: number;
}

const initialState: NotificationState = {
    count: 0,
}

const slice = createSlice({
    name: 'notificationCount',
    initialState,
    reducers: {
        decreaseUnreadNotificationCount: state => {
            state.count--
        },
        setUnreadNotificationCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
    },
});

export const {
    decreaseUnreadNotificationCount,
    setUnreadNotificationCount
} = slice.actions;

export default slice.reducer;