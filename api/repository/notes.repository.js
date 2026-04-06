import { prisma } from "../utils/prisma.js";

export const createNoteRepository = (data) => {
    return prisma.note.create({
        data,
    });
}

export const getAllNotesRepository = async (userId, lastSeenId , limit) => {
    console.log("Cursor received:", lastSeenId);
    // We use a transaction to get both the paginated data and the total count
    const [notes, totalNotesCount] = await prisma.$transaction([

        prisma.note.findMany({
            where: {
                userId,
            },
            orderBy: { id: 'desc' },
            cursor: lastSeenId ? { id: lastSeenId } : undefined,
            skip: lastSeenId ? 1 : 0,
            take: limit || 10,
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        }),

        prisma.note.count({
            where: { userId }
        })
    ]);

    return { notes, totalNotesCount };
}

export const getNoteByIdRepository = (userId, id) => {
    return prisma.note.findUnique({
        where: { id, userId },
        include: {
            tags: {
                include: {
                    tag: true
                }
            },
            tasks: true
        }
    })
}

export const updateNoteRepository = (userId, id, data) => {
    return prisma.note.update({
        where: { id, userId },
        data,
    });
}

export const deleteNoteRepository = (userId, id) => {
    return prisma.note.delete({
        where: { id, userId },
    });
}
// TAGS


export const getTagIdByNameRepository = (name, userId) => {
    return prisma.tag.findUnique({
        where: {
            name_userId: { name, userId }
        },
    });

}


export const addTagToNoteRepository = async (noteId, tagName, userId) => {

    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new Error("Note not found or unauthorized");
    }

    const tag = await prisma.tag.upsert({
        where: {
            name_userId: { name: tagName, userId }
        },
        create: { name: tagName, userId },
        update: {},
    });

    await prisma.noteTag.upsert({
        where: {
            noteId_tagId: { noteId, tagId: tag.id }
        },
        create: { noteId, tagId: tag.id },
        update: {},
    });

    return tag;
}

export const removeTagFromNoteRepository = async (noteId, tagId, userId) => {

    return prisma.noteTag.deleteMany({
        where: {
            noteId: noteId,
            tagId: tagId,
            note: {
                userId: userId
            }
        },
    });
}
export const getAllTagsRepository = (userId) => {
    return prisma.tag.findMany({
        where: {
            userId,

        },
        orderBy: {
            name: 'asc',
        },
    });
}

export const getNoteTagsRepository = async (noteId, userId) => {

    return prisma.noteTag.findMany({
        where: {
            noteId,
            note: {
                userId,
            },
        },
        include: {
            tag: true,
        },
    });
}

export const getNotesByTagRepository = (tagId, userId) => {


    return prisma.noteTag.findMany({
        where: {
            tagId,
            note: {
                userId,
            },

        },
        include: {
            note: true,
        },
    });
}
