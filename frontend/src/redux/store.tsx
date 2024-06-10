import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './reducers/Accounts'
import auctionSessionReducer from './reducers/AuctionSession'
import consignmentsReducer from './reducers/Consignments'
import itemsReducer from './reducers/Items'
import notificationsReducer from './reducers/Notifications'
import unreadNotificationCountReducer
  from "@/redux/reducers/UnreadNotificationCountReducer.ts";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    auctionSessions: auctionSessionReducer,
    consignments: consignmentsReducer,
    items: itemsReducer,
    notifications: notificationsReducer,
    unreadNotificationCount: unreadNotificationCountReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store