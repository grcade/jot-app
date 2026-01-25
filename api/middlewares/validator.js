import { body } from "express-validator";
import { validationResult } from 'express-validator';



const registerValidator = [
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid Email"),

    body("password")
        .trim()
        .isLength({ min: 6 })
        .matches(/[A-Z]/)   // uppercase
        .matches(/[a-z]/)   // lowercase
        .matches(/\d/)      // number
        .matches(/[@$!%*?&]/) // special
        .withMessage("Password must contain at least 6 characters, including uppercase, lowercase, number and special character"),

]

const loginValidator = [
    body('email').isEmail(),
    body('password').notEmpty()
]

const handleValidationError = (req, res, next) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    next();
}


export { registerValidator, loginValidator, handleValidationError }
