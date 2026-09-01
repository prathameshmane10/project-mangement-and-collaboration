import { ApiError } from "../utils/ApiError.js";

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(...allowedRoles);

        // 1. Ensure user object exists
        if(!req.user){
            throw new ApiError(401, 'Authentication required before authorization check.');
        }

        // 2. Check if user's role is included in allowed roles
        // if(!allowedRoles.user.role){
        //     throw new ApiError(403, `Access denied. Role '${req.user.role}' is not authorized to access this resource.`);
        // }

        // 3. User is authorized

        next();
    }
}