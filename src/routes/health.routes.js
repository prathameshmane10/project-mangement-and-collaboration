import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.get('/health', (req, res) => {
    return ApiResponse.success(res, 'Workflow API is running', {}, 200);
});

export default router;