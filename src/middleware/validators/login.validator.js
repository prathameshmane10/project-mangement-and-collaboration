import { ApiError } from "../../utils/ApiError.js";

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !email.trim()) {
        errors.push({
            field: 'email',
            message: 'Email is required',
        });
    }

    if (!password || !password.trim()) {
        errors.push({
            field: 'password',
            message: 'Password is required',
        });
    }

    if (errors.length > 0) {
        throw new ApiError(400, 'validation Faied', errors);
    }

    next()
}