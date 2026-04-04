import { apiSlice } from '../../api/apiSlice.js';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/user/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/user/register',
                method: 'POST',
                body: { ...userData },
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/user/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
} = authApiSlice;
