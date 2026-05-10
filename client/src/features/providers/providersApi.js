    import { baseApi } from '../api/baseApi.js'

    export const providersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getProviders: builder.query({
    query: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return query ? `/providers?${query}` : '/providers'
    },
    providesTags: ['Providers'],
    }),

        getProvider: builder.query({
        query: (id) => `/providers/${id}`,
        providesTags: ['Providers'],
        }),

        updateProfile: builder.mutation({
        query: (data) => ({
            url:    '/providers/profile',
            method: 'PATCH',
            body:   data,
        }),
        invalidatesTags: ['Providers'],
        }),

        toggleAvailability: builder.mutation({
        query: () => ({
            url:    '/providers/availability',
            method: 'PATCH',
        }),
        invalidatesTags: ['Providers', 'Auth'],
        }),

    }),
    })

    export const {
    useGetProvidersQuery,
    useGetProviderQuery,
    useUpdateProfileMutation,
    useToggleAvailabilityMutation,
    } = providersApi