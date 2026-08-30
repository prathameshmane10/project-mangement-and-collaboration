import { ApiError } from "../../utils/ApiError.js";

export const validateUser = (req, res, next) => {
    const { firstName, lastName, email, password, role, isActive } = req.body;
    const errors = [];

    if (!firstName || !firstName.trim()) {
        errors.push({
            field: 'firstName',
            message: 'First Name is required',
        });
    }
    if (!lastName || !lastName.trim()) {
        errors.push({
            field: 'lastName',
            message: 'last Name is required',
        });
    }
    if (!email || !email.trim()) {
        errors.push({
            field: 'email',
            message: 'email is required',
        });
    }
    if (!password || !password.trim()) {
        errors.push({
            field: 'password',
            message: 'password is required',
        });
    }
    if (!role || !role.trim()) {
        errors.push({
            field: 'role',
            message: 'role is required',
        });
    }


    if (errors.length > 0) {
        throw new ApiError(400, 'validation Faied', errors);
    }

    next();

}