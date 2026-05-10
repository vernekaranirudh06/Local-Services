    import { baseApi } from '../api/baseApi.js'

    export const bookingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createBooking: builder.mutation({
        query: (formData) => ({
            url:    '/bookings',
            method: 'POST',
            body:   formData,
        }),
        invalidatesTags: ['Bookings'],
        }),

        getMyBookings: builder.query({
        query: (status) => status ? `/bookings/my?status=${status}` : '/bookings/my',
        providesTags: ['Bookings'],
        }),

        getProviderBookings: builder.query({
        query: (status) => status ? `/bookings/provider?status=${status}` : '/bookings/provider',
        providesTags: ['Bookings'],
        }),

        getBooking: builder.query({
        query: (id) => `/bookings/${id}`,
        providesTags: ['Bookings'],
        }),

        updateStatus: builder.mutation({
        query: ({ id, ...data }) => ({
            url:    `/bookings/${id}/status`,
            method: 'PATCH',
            body:   data,
        }),
        invalidatesTags: ['Bookings'],
        }),

        cancelBooking: builder.mutation({
        query: ({ id, note }) => ({
            url:    `/bookings/${id}/cancel`,
            method: 'PATCH',
            body:   { note },
        }),
        invalidatesTags: ['Bookings'],
        }),

        rescheduleBooking: builder.mutation({
        query: ({ id, scheduledAt }) => ({
            url:    `/bookings/${id}/reschedule`,
            method: 'PATCH',
            body:   { scheduledAt },
        }),
        invalidatesTags: ['Bookings'],
        }),

        uploadJobImages: builder.mutation({
        query: ({ id, formData }) => ({
            url:    `/bookings/${id}/images`,
            method: 'POST',
            body:   formData,
        }),
        invalidatesTags: ['Bookings'],
        }),

    }),
    })

    export const {
    useCreateBookingMutation,
    useGetMyBookingsQuery,
    useGetProviderBookingsQuery,
    useGetBookingQuery,
    useUpdateStatusMutation,
    useCancelBookingMutation,
    useRescheduleBookingMutation,
    useUploadJobImagesMutation,
    } = bookingsApi