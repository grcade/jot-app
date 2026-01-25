
import { registerUserService, loginUserService, getUserProfileService } from '../Services/auth.service.js';





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
    }
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" })
}





const loginUser = async (req, res) => {


    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })

    }

    try {
        const token = await loginUserService(email, password)


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 48 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "Login successful", success: true })


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
        if (req.cookie.token) {
            const token = req.cookie.token
            const { email } = await getUserProfileService(token)


            return res.status(200).json({
                message: "User profile fetched successfully",
                success: true,
                data: {
                    email
                }
            })

        }

    } catch (error) {
        console.error("Get User Profile ERROR:", error);
        return res.status(500).json({
            message: "Failed to get user profile",
            success: false
        })
    }
}



export { registerUser, loginUser, logoutUser, getUserProfile }
