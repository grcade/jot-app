import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile } from '../Controllers/user.controller.js';
import { registerValidator, loginValidator, handleValidationError } from '../middlewares/validator.js';


const router = express.Router()


router.post('/register', registerValidator, handleValidationError, registerUser)

router.post('/login', loginValidator, handleValidationError, loginUser)

router.post('/logout', logoutUser)

router.get('/profile', getUserProfile)



export default router
