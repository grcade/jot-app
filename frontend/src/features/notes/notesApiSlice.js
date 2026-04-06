import { apiSlice } from '../../api/apiSlice';

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: (cursor) => cursor ? `/notes/all?cursor=${cursor}` : `/notes/all`,
            transformResponse: (response) => {

                return {
                    notes: response.notes.map(note => ({
                        ...note,
                        bg: note.bg || '#1a1a1a'
                    })), totalNotesCount: response.totalNotesCount
                };

            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.notes.map(({ id }) => ({ type: 'Note', id })),
                        { type: 'Note', id: 'LIST' },
                        'TagList'
                    ]
                    : [{ type: 'Note', id: 'LIST' }, 'TagList'],
        }),
        getNoteById: builder.query({
            query: (id) => `/notes/${id}`,
            transformResponse: (response) => response.note,
            providesTags: (result, error, id) => [{ type: 'Note', id }],
        }),
        addNote: builder.mutation({
            query: (note) => ({
                url: '/notes/create',
                method: 'POST',
                body: note,
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }, 'TagList'],
        }),
        updateNote: builder.mutation({
            query: ({ id, ...note }) => ({
                url: `/notes/${id}`,
                method: 'PUT',
                body: note,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }, { type: 'Note', id: 'LIST' }, 'TagList'],
        }),
        deleteNote: builder.mutation({
            query: (id) => ({
                url: `/notes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }, 'TagList'],
        }),
        // Tag related endpoints
        addTagToNote: builder.mutation({
            query: ({ id, tagName }) => ({
                url: `/notes/${id}/tags`,
                method: 'POST',
                body: { tagName }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }, { type: 'Note', id: 'LIST' }, 'TagList']
        }),
        removeTagFromNote: builder.mutation({
            query: ({ id, tagId }) => ({
                url: `/notes/${id}/tags`,
                method: 'DELETE',
                body: { tagId }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }, { type: 'Note', id: 'LIST' }, 'TagList']
        }),
        getNoteTags: builder.query({
            query: (id) => `/notes/${id}/tags`,
            transformResponse: (response) => response.tags,
            providesTags: (result, error, id) => [{ type: 'NoteTags', id }]
        }),
        getAllTags: builder.query({
            query: () => '/notes/tags/all',
            transformResponse: (response) => response.tags,
            providesTags: ['TagList']
        }),
        getNotesByTag: builder.query({
            query: (tagId) => `/notes/tag/${tagId}`,
            transformResponse: (response) => response.notes,
            providesTags: (result, error, tagId) => [{ type: 'TagNotes', id: tagId }]
        })
    }),
});

export const {
    useGetNotesQuery,
    useGetNoteByIdQuery,
    useAddNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
    useAddTagToNoteMutation,
    useRemoveTagFromNoteMutation,
    useGetNoteTagsQuery,
    useGetAllTagsQuery,
    useGetNotesByTagQuery
} = notesApiSlice;
