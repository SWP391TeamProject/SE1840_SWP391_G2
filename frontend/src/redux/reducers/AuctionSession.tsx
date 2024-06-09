import { AuctionSession } from "@/models/AuctionSessionModel";
import { createSlice } from "@reduxjs/toolkit"

interface AuctionSessionsState {
    loading: boolean,
    value: AuctionSession[],
    currentAuctionSession?: AuctionSession,
    currentPageList: AuctionSession[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    error: string
}

// Define the initial state using that type
const initialState: AuctionSessionsState = {
    loading: true,
    value: [],
    currentAuctionSession: undefined,
    currentPageList: [],
    currentPageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    error: ''
}

export const auctionSessionsSlice = createSlice({
    name: 'auctionSessions',
    initialState,
    reducers: {
        setAuctionSessions: (state, action) => {
            console.log(action.payload);
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentAuctionSession: (state, action) => {
            state.currentAuctionSession = action.payload;
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


export const { setAuctionSessions, setCurrentAuctionSession, setCurrentPageNumber, setCurrentPageList, error } = auctionSessionsSlice.actions;
export default auctionSessionsSlice.reducer