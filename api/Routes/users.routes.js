import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, refreshToken } from '../Controllers/user.controller.js';
import { registerValidator, loginValidator, handleValidationError } from '../middlewares/validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'



const router = express.Router()


router.post('/register', registerValidator, handleValidationError, registerUser)

router.post('/login', loginValidator, handleValidationError, loginUser)

router.post('/logout', logoutUser)

router.get('/profile', authMiddleware, getUserProfile)

router.get('/refresh', refreshToken)



export default router
