import { ApiError } from "../../utils/ApiError.js";
import { TASK_STATUS } from '../../models/Task.js';
import { TASK_PRIORITIES } from '../../models/Task.js';
import { z } from 'zod';

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

export const validateUpdateTask = z.Object({
    title: z
        .string()
        .trim()
        .min(1, 'Title cannot be empty')
        .max(150, 'Title cannot exceed 150 characters')
        .optional(),

    description: z
        .string()
        .trim()
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional(),
    assignedTo: z
        .string()
        .nullable()
        .refine((val) => val === null || /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid User ID for assignedTo',
        })
        .optional(),
    priority: z.nativeEnum(TASK_PRIORITY).optional(),
    status: z.nativeEnum(TASK_STATUS).optional(),
    dueDate: z
        .string()
        .nullable()
        .refine((val) => val === null || !isNaN(Date.parse(val)), {
            message: 'Invalid date format for dueDate',
        })
        .optional(),
    labels: z.array(z.string().trim()).optional(),
})

export const assignTaskSchema = z.object({
    assignedTo: z
        .string({
            required_error: 'assignedTo field is required',
        })
        .nullable() // Allows null to unassign a task
        .refine((val) => val === null || /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid User ID format',
        }),
});


export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TASK_STATUS, {
    errorMap: () => ({
      message: `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`,
    }),
  }),
});
