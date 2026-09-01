import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateUser } from "../middleware/validators/user.validator.js";
import { createUser } from '../controller/user.controller.js'
import { getUser } from '../controller/user.controller.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// GET /api/v1/users/me (Protected Route)
router.get('/me', authenticate, (req, res) => {
    return ApiResponse.success(res, 'User profile fetched successfully', req.user);
});

router.post('/create', validateUser, authenticate, createUser);


// http://localhost:5000/api/v1/users/find?page=2&limit=5
router.get('/find', authenticate, getUser);

export default router;