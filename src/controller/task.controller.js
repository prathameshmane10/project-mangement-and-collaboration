import { TaskService } from '../services/task.service.js'
import { asyncErrorHandler } from "../utils/AsyncHandle.js";
import { ApiResponse } from '../utils/ApiResponse.js';

export const createTask = asyncErrorHandler(async (req, res) => {
    const task = await TaskService.createTask(req.body, req.user._id);
    return ApiResponse.success(
        res,
        'Task created successfully',
        task,
        201);
});

export const getTask = asyncErrorHandler(async (req, res) => {
    const result = await TaskService.getTask(req.query, req.user);
    return ApiResponse.success(
        res,
        'Tasks fetched successfully',
        result,
        200
    );
});

export const getTaskById = asyncErrorHandler(async (req, res) => {
    const task = await TaskService.getTaskById(req.params.id, req.user);
    return ApiResponse.success(
        res,
        'Task fetched successfully',
        task,
        200
    );
});