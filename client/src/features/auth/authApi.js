    import { baseApi } from '../api/baseApi.js'

    export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        register: builder.mutation({
        query: (data) => ({
            url:    '/auth/register',
            method: 'POST',
            body:   data,
        }),
        }),

        login: builder.mutation({
        query: (data) => ({
            url:    '/auth/login',
            method: 'POST',
            body:   data,
        }),
        }),

        getMe: builder.query({
        query: () => '/auth/me',
        providesTags: ['Auth'],
        }),

    }),
    })

    export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi