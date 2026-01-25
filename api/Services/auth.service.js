import crypto from "crypto";
import {
    findUserByEmail,
    findUserById,
    createUser,
} from "../repository/user.repository.js";
import {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
} from "../utils/auth.utils.js";

export const registerUserService = async (email, password) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
    });

    return user.id;
};

export const loginUserService = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = generateToken({ id: user.id });

    return token;
};

export const getUserProfileService = async (token) => {
    const decoded = verifyToken(token);

    const user = await findUserById(decoded.id);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    return {
        email: user.email,
    };
};
