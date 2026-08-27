import { ApiError } from '../utils/ApiError.js';
import { asyncErrorHandler } from '../utils/AsyncHandle.js';
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authenticate = asyncErrorHandler(async (req, res, next) => {
    // Get authentication header 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new ApiError(401, 'Access Denied, No Token Provided');
    }

    // Extarct JWT Token 
    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT Token
        const decoded = verifyAccessToken(token);

        // Find User in DB
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, 'User associated with this token no longer exists.');
        }

        if (!user.isActive) {
            throw new ApiError(401, 'User account is deactivated.');
        }

        // Attach User to req.user
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token has expired.');
        }

        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'Invalid token.');
        }
        throw error;
    }
})
