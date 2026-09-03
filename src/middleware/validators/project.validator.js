import { ApiError } from "../../utils/ApiError.js";
import { PROJECT_STATUS } from '../../models/Project.js';

export const validateProject = (req, res, next) => {
    const { name, status, startDate, endDate } = req.body;
    const errors = [];

    if (!name || !name.trim()) {
        errors.push({
            field: name,
            message: 'Project name is required',
        });
    }

    if (status && !Object.values(PROJECT_STATUS).includes(status)) {
        errors.push({
            field: status,
            message: `Status must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`
        });
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        errors.push({ field: 'endDate', message: 'End date must be greater than or equal to start date' });
    }

    if (errors.length > 0) {
        throw new ApiError(400, 'Validation failed', errors);
    }

    next();
}


export const validateUpdateProject = (req, res, next) => {
    const { name, status, startDate, endDate } = req.body;
    const errors = [];

    if (name !== undefined && (!name || !name.trim())) {
        errors.push({
            field: 'name',
            message: 'Project name cannot be empty',
        });
    }

    if (status && !Object.values(PROJECT_STATUS).includes(status)) {
        errors.push({
            field: 'status',
            message: `Status must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`
        });
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        errors.push({
            field: 'endDate',
            message: 'End date must be greater than or equal to start date',
        });
    }

    if (errors.length > 0) {
        throw new ApiError(400, 'Validation failed', errors);
    }

    next();


}

