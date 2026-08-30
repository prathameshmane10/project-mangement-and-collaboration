import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middlware.js";
import { validateProject } from '../middleware/validators/project.validator.js';
import { createProject } from '../controller/project.controller.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { ROLES } from "../models/User.js";

const router = Router();

// 1. All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => {
    return ApiResponse.success(res, 'Project Fetched successfuly', []);
});

router.post('/create', 
    authorize(ROLES.ADMIN, ROLES.MANAGER), 
    validateProject, 
    createProject);

router.delete('/:id', authorize(ROLES.SUPER_ADMIN), (req, res) => {
    return ApiResponse.success(res, 'Project deleted successfully');
});

export default router;