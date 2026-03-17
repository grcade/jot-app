import { createNoteRepository, getAllNotesRepository, getNoteByIdRepository, updateNoteRepository, deleteNoteRepository, getAllTagsRepository, getNoteTagsRepository, getNotesByTagRepository, removeTagFromNoteRepository, addTagToNoteRepository } from '../repository/notes.repository.js';

const createNoteService = async (userId, title, description, color) => {
    const noteData = {
        userId,
        title,
        desc: description,
        color
    };
    return await createNoteRepository(noteData);
}

const getAllNotesService = (userId) => {

    return getAllNotesRepository(userId);
}


const getNoteByIdService = (userId, id) => {
    return getNoteByIdRepository(userId, id);
}

const updateNoteService = async (userId, id, title, description, bg) => {
    return await updateNoteRepository(userId, id, { title, desc: description, bg });
}

const deleteNoteService = async (userId, id) => {
    return await deleteNoteRepository(userId, id);
}


const getAllTagsService = (userId) => {
    return getAllTagsRepository(userId);
}

const getNoteTagsService = (noteId, userId) => {
    return getNoteTagsRepository(noteId, userId);
}

const getNotesByTagService = (tagId, userId) => {
    return getNotesByTagRepository(tagId, userId);
}

const removeTagFromNoteService = (noteId, tagId, userId) => {
    return removeTagFromNoteRepository(noteId, tagId, userId);
}

const addTagToNoteService = (noteId, tagName, userId) => {
    return addTagToNoteRepository(noteId, tagName, userId);
}




export { createNoteService, getAllNotesService, getNoteByIdService, updateNoteService, deleteNoteService, getAllTagsService, getNoteTagsService, getNotesByTagService, removeTagFromNoteService, addTagToNoteService }
