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

    static async updateTask(taskId, taskData, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApiError(400, 'Invalid task ID');
        }

        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (currentUser.role === 'MEMBER') {
            const project = task.project;
            const isOwner = project.owner.toString() === currentUser._id.toString();
            const isMember = project.members.some(
                (m) => m.toString() === currentUser._id.toString()
            );
            if (!isOwner && !isMember) {
                throw new ApiError(403, 'You do not have permission to update this task');
            }
        }

        if (updateData.assignedTo) {
            const userExists = await User.exists({ _id: updateData.assignedTo });
            if (!userExists) {
                throw new ApiError(404, 'Assigned user does not exist');
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updateData },
            { new: true, runValidators: true } // new: true returns updated doc
        )
            .populate('project', 'name status')
            .populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email');

        return updatedTask;
    }

    static async deleteTask(taskId, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApiError(400, 'Invalid task ID');
        }

        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }
        // Authorization Checks:
        // 1. SUPER_ADMIN and ADMIN can delete any task.
        // 2. MANAGER or task creator (createdBy) can delete within their authorized projects.
        // 3. Regular MEMBER can only delete if they created the task AND belong to the project.
        const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role);
        const isTaskCreator = task.createdBy.toString() === currentUser._id.toString();

        const project = await Project.findById(task.projectId);
        const isProjectOwner = project.owner.toString() === currentUser._id.toString();
        const isProjectMember = project.members.some(
            (m) => m.toString() === currentUser._id.toString()
        );

        if (!isSuperOrAdmin) {
            if (!isProjectOwner && !isTaskCreator) {
                throw new ApiError(
                    403,
                    'Access denied. Only project owners, admins, or task creators can delete this task.'
                );
            }
        }

        if (currentUser.role === 'MEMBER' && !isProjectMember) {
            throw new ApiError(
                403,
                'Access denied. You do not belong to the project associated with this task.'
            );
        }

        await Task.findByIdAndDelete(taskId);
        return { deletedTaskId: taskId };
    }

    static async assignTaskToUser(taskId, assignedToUserId, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApiError(400, 'Invalid task ID or user ID');
        }

        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const project = task.project;

        // Authorization Check:
        // Only SUPER_ADMIN, ADMIN, Project Owner, or Task Creator can assign/reassign tasks
        const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role);
        const isProjectOwner = project.owner.toString() === currentUser._id.toString();
        const isTaskCreator = task.createdBy.toString() === currentUser._id.toString();

        if (!isSuperOrAdmin && !isProjectOwner && !isTaskCreator) {
            throw new ApiError(
                403,
                'Access denied. Only project owners, admins, or task creators can assign this task.'
            );
        }

        // If assignedTo is provided (not null), verify target user exists and belongs to project
        if (assignedToUserId) {
            const targetUser = await User.findById(assignedToUserId);
            if (!targetUser) {
                throw new ApiError(404, 'User to be assigned does not exist');
            }
        }

        // Ensure assigned user is part of the project (owner or member)
        const isOwner = project.owner.toString() === assignedToUserId;
        const isMember = project.members.some(
            (memberId) => memberId.toString() === assignedToUserId
        );

        if (!isOwner && !isMember) {
            throw new ApiError(
                400,
                'Cannot assign task to a user who is not a member of this project.'
            );
        }

        task.assignedTo = assignedToUserId;
        await task.save();

        return await task.populate([
            { path: 'project', select: 'name status' },
            { path: 'assignedTo', select: 'firstName lastName email role' },
            { path: 'createdBy', select: 'firstName lastName email role' },
        ]);
    }

    static async updateTaskStatus(taskId, newStatus, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApiError(400, 'Invalid task ID');
        }
        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        const project = task.project;

        // Authorization Checks:
        // 1. SUPER_ADMIN, ADMIN, or Project Owner can update status.
        // 2. Assignee or Task Creator can update status.
        // 3. Project Member can update status if they belong to the project.
        const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role);
        const isProjectOwner = project.owner.toString() === currentUser._id.toString();
        const isTaskCreator = task.createdBy.toString() === currentUser._id.toString();
        const isAssignee = task.assignedTo
            ? task.assignedTo.toString() === currentUser._id.toString()
            : false;
        const isProjectMember = project.members.some(
            (m) => m.toString() === currentUser._id.toString()
        );

        const isAuthorized = isSuperOrAdmin || isProjectOwner || isTaskCreator || isAssignee || isProjectMember;
        if (!isAuthorized) {
            throw new ApiError(
                403,
                'Access denied. You do not have permission to change the status of this task.'
            );
        }

        task.status = newStatus;
        await task.save();

        return await task.populate([
            { path: 'project', select: 'name status' },
            { path: 'assignedTo', select: 'firstName lastName email role' },
            { path: 'createdBy', select: 'firstName lastName email role' },
        ]);
    }
}
