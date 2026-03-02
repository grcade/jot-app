// creae tasks
// get all tasks
// get task by id
// update task
// delete task
// mark task as completed
import { prisma } from "../utils/prisma.js";


export const addTask = (data) => {
    return prisma.task.create({
        data,
    });
}

export const getAllTasks = (noteId, userId) => {
    return prisma.task.findMany({
        where: {
            noteId: noteId,
            note: {
                userId: userId,
            }
        },
    });
}

export const getTaskById = (userId, id) => {
    return prisma.task.findFirst({
        where: {
            id: id,
            note: {
                userId: userId,
            }
        },
    });
}

export const updateTask = (userId, id, data) => {
    return prisma.task.update({
        where: {
            id: id,
            note: {
                userId: userId,
            }
        },
        data: data,
    });
}

export const deleteTask = (userId, id) => {
    return prisma.task.delete({
        where: {
            id: id,
            note: {
                userId: userId,
            }
        }
    })
}

export const updateTaskStatus = (userId, id, status) => {
    return prisma.task.update({
        where: {
            id: id,
            note: {
                userId: userId,
            }

        },
        data: {
            status: status,
        }
    })
}
