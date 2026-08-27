import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// GET /api/v1/users/me (Protected Route)
router.get('/me', authenticate, (req, res) => {
    return ApiResponse.success(res, 'User profile fetched successfully', req.user);
});

export default router;