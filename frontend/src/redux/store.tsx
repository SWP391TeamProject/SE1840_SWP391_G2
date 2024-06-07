import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './reducers/Accounts'
import auctionSessionReducer from './reducers/AuctionSession'
import consignmentsReducer from './reducers/Consignments'
import itemsReducer from './reducers/Items'
import notificationsReducer from './reducers/Notifications'

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    auctionSessions: auctionSessionReducer,
    consignments: consignmentsReducer,
    items: itemsReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store