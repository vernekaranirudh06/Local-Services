    import { baseApi } from '../api/baseApi.js'

    export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        submitReview: builder.mutation({
        query: ({ bookingId, ...data }) => ({
            url:    `/reviews/${bookingId}`,
            method: 'POST',
            body:   data,
        }),
        invalidatesTags: ['Reviews', 'Bookings'],
        }),

        getProviderReviews: builder.query({
        query: (providerId) => `/reviews/provider/${providerId}`,
        providesTags: ['Reviews'],
        }),

    }),
    })

    export const { useSubmitReviewMutation, useGetProviderReviewsQuery } = reviewsApi