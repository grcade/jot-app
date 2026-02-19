import { prisma } from "../utils/prisma.js";

export const createNote = (data) => {
    return prisma.note.create({
        data,
    });
}

export const getAllNotes = (userId) => {
    return prisma.note.findMany({
        where: { userId }
    })
}

export const getNoteById = (userId, id) => {
    return prisma.note.findUnique({
        where: { id, userId }
    })
}

export const updateNote = (userId, id, data) => {
    return prisma.note.update({
        where: { id, userId },
        data,
    });
}

export const deleteNote = (userId, id) => {
    return prisma.note.delete({
        where: { id, userId },
    });
}
