import { ApiError } from "../../utils/ApiError.js";
import { TASK_STATUS } from '../../models/Task.js';
import { TASK_PRIORITIES } from '../../models/Task.js';

export const validateTask = (req, res, next) => {
    const { title, description, priority, status } = req.body;
    const errors = [];
    if (!title || !title.trim()) {
        errors.push({
            field: 'title',
            message: 'Task title is required',
        });
    }

    if (!description || !description.trim()) {
        errors.push({
            field: 'description',
            message: 'Task description is required',
        });
    }

    if (priority && !Object.values(TASK_PRIORITIES).includes(priority)) {
        errors.push({
            field: 'priority',
            message: `Priority must be one of: ${Object.values(TASK_PRIORITIES).join(', ')}`
        });
    }

    if (status && !Object.values(TASK_STATUS).includes(status)) {
        errors.push({
            field: 'status',
            message: `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`
        });
    }

    if (errors.length > 0) {
        return next(new ApiError(400, 'Validation failed', errors));
    }

    next();
};