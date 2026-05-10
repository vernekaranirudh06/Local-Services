    import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

    export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.token ?? localStorage.getItem('token')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
        },
    }),
    tagTypes: ['Auth', 'Services', 'Providers', 'Bookings', 'Reviews', 'Admin'],
    endpoints: () => ({}),
    // ✅ Add these two lines
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    })