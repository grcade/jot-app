import crypto from "crypto";
import {
    findUserByEmail,
    findUserById,
    createUser,
    clearRefreshToken,
    findUserByRefreshToken,
    addRefreshToken
} from "../repository/user.repository.js";
import {
    hashPassword,
    comparePassword,
    generateToken,
    verifyRefreshToken,
    generateRefreshToken
} from "../utils/auth.utils.js";
import { console } from "inspector";

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

    const accessToken = generateToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });
    await addRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
};

export const getUserProfileService = async (id) => {
    const user = await findUserById(id);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    return {
        email: user.email,
    };
};

export const logoutUserService = async (refreshToken) => {
    const tokenRecord = await findUserByRefreshToken(refreshToken);
    if (tokenRecord) {
        await clearRefreshToken(tokenRecord.userId);
    }
};


export const refreshTokenService = async (refreshToken) => {
    console.log("Received refresh token:", refreshToken);
    console.log("Verifying refresh token with secret:", process.env.JWT_REFRESH_SECRET);
    try {
        verifyRefreshToken(refreshToken);
    } catch (err) {
        console.log("Verification failed inside service:", err);
        throw err;
    }

    console.log("Refresh token is valid. Finding user by refresh token...");
    const tokenRecord = await findUserByRefreshToken(refreshToken);
    console.log("Token record found for refresh token:", tokenRecord);

    if (!tokenRecord) {
        throw new Error("Invalid Refresh Token")
    }

    const user = await findUserById(tokenRecord.userId);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    const newAccessToken = generateToken({ id: user.id });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    await clearRefreshToken(user.id);
    await addRefreshToken(user.id, newRefreshToken);

    return { newAccessToken, newRefreshToken };
}
