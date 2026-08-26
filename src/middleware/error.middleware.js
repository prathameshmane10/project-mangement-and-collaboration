import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { statusCode = 500, message = 'Internal Server error', errors = [] } = err;

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'A user with this email already exists';
    }
    return ApiResponse.error(res, message, errors, statusCode);
}
