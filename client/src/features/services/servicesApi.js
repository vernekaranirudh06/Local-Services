    import { baseApi } from '../api/baseApi.js'

    export const servicesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getServices: builder.query({
        query: (category) => category ? `/services?category=${category}` : '/services',
        providesTags: ['Services'],
        }),

        getService: builder.query({
        query: (id) => `/services/${id}`,
        providesTags: ['Services'],
        }),

        createService: builder.mutation({
        query: (formData) => ({
            url:    '/services',
            method: 'POST',
            body:   formData, // FormData for image upload
        }),
        invalidatesTags: ['Services'],
        }),

        updateService: builder.mutation({
        query: ({ id, ...data }) => ({
            url:    `/services/${id}`,
            method: 'PATCH',
            body:   data,
        }),
        invalidatesTags: ['Services'],
        }),

        deactivateService: builder.mutation({
        query: (id) => ({
            url:    `/services/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Services'],
        }),

    }),
    })

    export const {
    useGetServicesQuery,
    useGetServiceQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeactivateServiceMutation,
    } = servicesApi