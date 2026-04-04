import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../utils/env';
import { setCredentials, logout } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQuery(
            {
                url: '/user/refresh',
                method: 'POST',
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            // store the new token
            api.dispatch(setCredentials({ accessToken: refreshResult.data.accessToken }));
            // retry the original query
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'Task', 'User'],
    endpoints: (builder) => ({}),
});
