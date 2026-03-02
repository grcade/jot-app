import { prisma } from "../utils/prisma.js";


export const findUserByEmail = (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const findUserById = (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
};

export const createUser = (data) => {
    return prisma.user.create({
        data,
    });
};


export const addRefreshToken = (id, refreshToken) => {



    return prisma.refreshToken.upsert({
        where: { userId: id },
        update: { token: refreshToken, userId: id, createdAt: new Date(), valid: true },
        create: { token: refreshToken, userId: id },
    });
}

export const updateRefreshToken = (id, refreshToken) => {
    return prisma.refreshToken.update({
        where: { userId: id },
        data: { token: refreshToken },
    });
}




export const findUserByRefreshToken = (refreshToken) => {
    return prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });
}

export const clearRefreshToken = (id) => {
    return prisma.refreshToken.delete({
        where: { userId: id },
    });
}

export const invalidrefreshToken = async (refreshToken) => {
    return prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { valid: false },
    });
}
