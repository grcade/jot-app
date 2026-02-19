import { verifyAccessToken } from "../utils/auth.utils.js";

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided", success: false });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided", success: false });
    }
    try {

        const decoded = verifyAccessToken(token)



        req.user = decoded;
        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            console.log("Expired token", error.message);
            return res.status(401).json({ message: "Token expired", success: false });
        } else {
            console.error("Auth Middleware ERROR:", error);
            return res.status(401).json({ message: "Invalid or expired token", success: false });
        }

    }


}

export { authMiddleware }
