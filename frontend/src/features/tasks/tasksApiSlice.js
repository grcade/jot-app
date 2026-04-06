import { apiSlice } from '../../api/apiSlice';

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTasksByNote: builder.query({
            query: (noteId) => `/tasks/note/${noteId}`,
            transformResponse: (response) => response.tasks,
            providesTags: (result, error, noteId) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Task', id })), { type: 'Task', id: `LIST-${noteId}` }]
                    : [{ type: 'Task', id: `LIST-${noteId}` }],
        }),
        createTask: builder.mutation({
            query: ({ noteId, ...task }) => ({
                url: `/tasks/note/${noteId}`,
                method: 'POST',
                body: task,
            }),
            invalidatesTags: (result, error, { noteId }) => [{ type: 'Task', id: `LIST-${noteId}` }],
        }),
        updateTask: builder.mutation({
            query: ({ id, ...task }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: task,
            }),
            invalidatesTags: (result, error, { noteId, id }) => [
                { type: 'Task', id },
                { type: 'Task', id: `LIST-${noteId}` }
            ],
        }),
        updateTaskStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/tasks/${id}/update-status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { noteId, id }) => [
                { type: 'Task', id },
                { type: 'Task', id: `LIST-${noteId}` }
            ],
        }),
        deleteTask: builder.mutation({
            query: ({ id }) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { noteId }) => [{ type: 'Task', id: `LIST-${noteId}` }],
        }),
    }),
});

export const {
    useGetTasksByNoteQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
} = tasksApiSlice;
