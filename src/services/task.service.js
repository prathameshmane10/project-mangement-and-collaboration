import Task from '../models/Task.js';
import mongoose from "mongoose";

export class TaskService {
    static async createTask(taskData, creatorId) {
        const { title, description, priority, status, assignedTo, projectId, dueDate, labels } = taskData;
        const task = await Task.create({
            title,
            description,
            priority,
            status,
            assignedTo,
            projectId,
            dueDate,
            labels,
            createdBy: creatorId
        });
        return task;
    }

    static async getTask(queryParams, currentUser) {
        const { page = 1, limit = 10, search, status, sort = '-createdAt' } = queryParams;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const query = {};

        if (status) {
            query.status = status.toUpperCase();
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (currentUser.role === 'MEMBER') {
            query.$or = [
                { createdBy: currentUser._id },
                { assignedTo: currentUser._id },
            ]
        }

        const sortBy = sort.split(',').join(' ');

        const [tasks, totalTasks] = await Promise.all([
            Task.find(query)
                .populate('createdBy', 'firstName lastName email role')
                .populate('assignedTo', 'firstName lastName email role')
                .populate('projectId', 'name description status startDate endDate')
                .sort(sortBy)
                .skip(skip)
                .limit(limitNum),
            Task.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalTasks / limitNum);
        return {
            tasks,
            pagination: {
                totalTasks,
                totalPages,
                currentPage: pageNum,
                pageSize: limitNum,
            },
        };
    }

    static async getTaskById(taskId, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApiError(400, 'Invalid task ID');
        }

        const task = await Task.findById(taskId)
            .populate('createdBy', 'firstName lastName email role')
            .populate('assignedTo', 'firstName lastName email role')
            .populate('projectId', 'name description status startDate endDate');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (currentUser.role === 'MEMBER') {
            const isCreator = task.createdBy._id.toString() === currentUser._id.toString();
            const isAssignee = task.assignedTo && task.assignedTo._id.toString() === currentUser._id.toString();
            if (!isCreator && !isAssignee) {
                throw new ApiError(403, 'You do not have permission to access this task');
            }
        }

        return task;

    }
}

