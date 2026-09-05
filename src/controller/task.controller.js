import { TaskService } from '../services/task.service.js'
import { asyncErrorHandler } from "../utils/AsyncHandle.js";
import { updateTaskSchema, assignTaskSchema, updateTaskStatusSchema } from '../middleware/validators/task.validator.js';
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

export const updateTask = asyncErrorHandler(async (req, res) => {
    const { taskId } = req.params;
    const validatedata = updateTaskSchema.validate(req.body);

    const updateTask = await TaskService.updateTask(taskId, validatedata, req.user);

    return ApiResponse.success(
        res,
        'Task updated successfully',
        updateTask,
        200
    );
});

export const deleteTask = asyncErrorHandler(async (req, res) => {
    const { taskId } = req.params;
    const result = await TaskService.deleteTask(taskId, req.user);
    return ApiResponse.success(
        res,
        'Task deleted successfully',
        result,
        200
    );
});

export const assignTaskToUser = asyncErrorHandler(async (req, res) => {
    const { taskId } = req.params;
    const { assignedTo } = assignTaskSchema.parse(req.body);

    const updatedTask = await TaskService.assignTask(
        taskId,
        assignedTo,
        req.user
    );

    const message = assignedTo
        ? 'Task assigned successfully'
        : 'Task unassigned successfully';

    return ApiResponse.success(
        res,
        message,
        updatedTask,
        200
    );

});

export const updateTaskStatus = asyncErrorHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = updateTaskStatusSchema.parse(req.body);

    const updatedTask = await TaskService.updateTaskStatus(
        taskId,
        status,
        req.user
    );

    return ApiResponse.success(
        res,
        'Task status updated successfully',
        updatedTask,
        200,
    )

});
