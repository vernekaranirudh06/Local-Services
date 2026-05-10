import { configureStore } from '@reduxjs/toolkit'
import authReducer    from '../features/auth/authSlice.js'
import bookingReducer from '../features/bookings/bookingSlice.js'
import { baseApi }    from '../features/api/baseApi.js'

// Import all api files so their endpoints get injected into baseApi
import '../features/auth/authApi.js'
import '../features/services/servicesApi.js'
import '../features/providers/providersApi.js'
import '../features/bookings/bookingsApi.js'
import '../features/reviews/reviewsApi.js'
import '../features/admin/adminApi.js'

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    booking: bookingReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})