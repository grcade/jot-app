import { createNote, getAllNotes, getNoteById, updateNote, deleteNote, } from '../repository/notes.repository.js';

const createNoteService = async (userId, title, description, color) => {
    const noteData = {
        userId,
        title,
        desc: description,
        color
    };
    return await createNote(noteData);
}

const getAllNotesService = (userId) => {

    return getAllNotes(userId);
}


const getNoteByIdService = (userId, id) => {
    return getNoteById(userId, id);
}

const updateNoteService = async (userId, id, title, description, bg) => {
    return await updateNote(userId, id, { title, desc: description, bg });
}

const deleteNoteService = async (userId, id) => {
    return await deleteNote(userId, id);
}

export { createNoteService, getAllNotesService, getNoteByIdService, updateNoteService, deleteNoteService }
