import { ProjectService } from '../services/project.service.js';
import { asyncErrorHandler } from "../utils/AsyncHandle.js";
import { ApiResponse } from '../utils/ApiResponse.js';

export const createProject = asyncErrorHandler(async (req, res) => {
    const project = await ProjectService.createProject(req.body, req.user._id);
    return ApiResponse.success(
        res,
        'Project created successfully',
        project,
        201);

});


export const getProject = asyncErrorHandler(async (req, res) => {
    const result = await ProjectService.getProject(req.query, req.user);
    return ApiResponse.success(
        res,
        'Projects fetched successfully',
        result,
        200
    );
})