import { AuthService } from "../middleware/services/auth.service.js";
import { asyncErrorHandler } from "../utils/AsyncHandle.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = asyncErrorHandler(async (req, res) => {
    const user = await AuthService.registerUser(req.body);

    return ApiResponse.success(
        res,
        'User registered Successfully',
        user,
        201
    );
});


export const login = asyncErrorHandler(async (req, res) => {
    const loginData = await AuthService.loginUser(req.body);

    return ApiResponse.success(
        res,
        'User logged in successfully',
        loginData,
        200
    );
});