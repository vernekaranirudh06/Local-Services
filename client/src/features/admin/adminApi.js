    import { baseApi } from '../api/baseApi.js'

    export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getPendingProviders: builder.query({
        query: () => '/admin/providers/pending',
        providesTags: ['Admin'],
        }),

        approveProvider: builder.mutation({
        query: (id) => ({
            url:    `/admin/providers/${id}/approve`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Admin', 'Providers'],
        }),

        rejectProvider: builder.mutation({
        query: (id) => ({
            url:    `/admin/providers/${id}/reject`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Admin'],
        }),

        getPendingReviews: builder.query({
        query: () => '/admin/reviews/pending',
        providesTags: ['Admin', 'Reviews'],
        }),

        approveReview: builder.mutation({
        query: (id) => ({
            url:    `/admin/reviews/${id}/approve`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Admin', 'Reviews'],
        }),

        rejectReview: builder.mutation({
        query: (id) => ({
            url:    `/admin/reviews/${id}/reject`,
            method: 'PATCH',
        }),
        invalidatesTags: ['Admin', 'Reviews'],
        }),

        getAllBookings: builder.query({
        query: (status) => status ? `/admin/bookings?status=${status}` : '/admin/bookings',
        providesTags: ['Admin', 'Bookings'],
        }),

    }),
    })

    export const {
    useGetPendingProvidersQuery,
    useApproveProviderMutation,
    useRejectProviderMutation,
    useGetPendingReviewsQuery,
    useApproveReviewMutation,
    useRejectReviewMutation,
    useGetAllBookingsQuery,
    } = adminApi