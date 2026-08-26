import { ApiError } from "../../utils/ApiError.js";

const validateRegister = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const errors = [];

    if (!firstName || !firstName.trim()) {
        errors.push({ field: 'firstName', message: 'First name is required' })
    }
    if (!lastName || !lastName.trim()) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
    }

    if (!password || password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    if (errors.length > 0) {
        throw new ApiError(400, 'Validation failed', errors);
    }

    next();
}

export default validateRegister;