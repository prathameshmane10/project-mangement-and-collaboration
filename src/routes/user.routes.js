import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateUser } from "../middleware/validators/user.validator.js";
import { createUser } from '../controller/user.controller.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// GET /api/v1/users/me (Protected Route)
router.get('/me', authenticate, (req, res) => {
    return ApiResponse.success(res, 'User profile fetched successfully', req.user);
});

router.post('/create', validateUser, authenticate, createUser);

export default router;