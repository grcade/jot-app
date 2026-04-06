
import process from 'node:process';
import { registerUserService, loginUserService, getUserProfileService, logoutUserService, refreshTokenService } from '../Services/auth.service.js';





const registerUser = async (req, res) => {



    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })

    }


    try {

        const user = await registerUserService(email, password)


        return res.status(201).json({ message: "User registered successfully", userId: user.id })

    } catch (error) {
        if (error.message === "USER_ALREADY_EXISTS") {
            return res.status(400).json({ message: "User already exists" })
        }
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}





const loginUser = async (req, res) => {


    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })

    }

    try {
        const { accessToken, refreshToken } = await loginUserService(email, password)


        res.cookie('token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });



        return res.status(200).json({ message: "Login successful", accessToken: accessToken, success: true })


    } catch (error) {
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            })
        }
        console.error("Login ERROR:", error);
        return res.status(500).json({
            message: "Failed to login user",
            success: false
        })
    }




}

const logoutUser = async (req, res) => {
    try {

        if (!req.cookies?.token) {
            return res.status(400).json({
                message: "No token found, user already logged out",
                success: false,
            });
        }
        if (req.cookies.token) {
            const refreshToken = req.cookies.token;
            await logoutUserService(refreshToken);
            res.clearCookie("token")
            return res.status(200).json({
                message: "User logged out successfully",
                success: true
            })
        } else {
            return res.status(400).json({
                message: "No token found, user already logged out",
                success: false
            })
        }
    } catch (error) {
        console.error("Logout ERROR:", error);
        return res.status(500).json({
            message: "Failed to log out user",
            success: false
        })
    }
}



const getUserProfile = async (req, res) => {

    try {
        const { id } = req.user;
        const { email } = await getUserProfileService(id)


        return res.status(200).json({
            message: "User profile fetched successfully",
            success: true,
            data: {
                email
            }
        })

    }

    catch (error) {
        console.error("Get User Profile ERROR:", error);
        return res.status(500).json({
            message: "Failed to get user profile",
            success: false
        })
    }
}



const refreshToken = async (req, res) => {
    try {

        if (!req.cookies.token) {
            return res.status(400).json({
                message: "No refresh token provided",
                success: false
            })
        }

        const { newAccessToken, newRefreshToken } = await refreshTokenService(req.cookies.token)


        res.cookie('token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Token refreshed successfully",
            success: true,
            accessToken: newAccessToken
        })

    } catch (error) {
        console.error("Refresh Token ERROR:", error);
        if (error.name === "Invalid Refresh Token") {
            return res.status(403).json({
                message: "Invalid refresh token",
                success: false
            })
        }
        if (error.name === 'TokenExpiredError') {
            console.log("Expired token", error.message);
            return res.status(401).json({ message: "Token expired", success: false });
        }
        return res.status(401).json({
            message: "Failed to refresh token",
            success: false
        })

    }
}



export { registerUser, loginUser, logoutUser, getUserProfile, refreshToken }
