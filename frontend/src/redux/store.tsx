import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './reducers/Accounts'
import auctionSessionReducer from './reducers/AuctionSession'
import consignmentsReducer from './reducers/Consignments'
export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    auctionSessions: auctionSessionReducer,
    consignments: consignmentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store