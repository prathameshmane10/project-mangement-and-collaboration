// import Project from "../../models/Project.js";
import Project from '../models/Project.js'
import mongoose from "mongoose";

export class ProjectService {
    static async createProject(projectData, ownerId) {
        const { name, description, members, status, startDate, endDate } = projectData;

        const uniqueMembers = Array.from(
            new Set([ownerId.toString(), ...(members || [])])
        );

        const project = await Project.create({
            name,
            description,
            owner: ownerId,
            members: uniqueMembers,
            status,
            startDate,
            endDate,
        });

        return await project.populate('owner', 'firstName lastName email role');
    }


    static async getProject(queryParams, currentUser) {
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
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (currentUser.role === 'MEMBER') {
            query.$or = [
                { owner: currentUser._id },
                { members: currentUser._id },
            ]
        }


        const sortBy = sort.split(',').join(' ');

        const [projects, totalProjects] = await Promise.all([
            Project.find(query)
                .populate('owner', 'firstname lastName email role')
                .populate('members', 'firstName lastName email role')
                .sort(sortBy)
                .skip(skip)
                .limit(limitNum),
            Project.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalProjects / limitNum);
        return {
            projects,
            pagination: {
                totalProjects,
                totalPages,
                currentPage: pageNum,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        };
    }

    static async getProjectById(projectId, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new ApiError(400, 'Invalid project ID');
        }

        const project = await Project.findById(projectId)
            .populate('owner', 'firstName lastName email role')
            .populate('members', 'firstName lastName email role');

        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        if (currentUser.role === 'MEMBER') {
            const isOwner = project.owner._id.toString() === currentUser._id.toString();
            const isMember = project.members.some(
                (m) => m._id.toString() === currentUser._id.toString()
            );

            if (!isOwner && !isMember) {
                throw new ApiError(403, 'You do not have permission to access this project');
            }
        }



        return project;
    }

    static async updateProject(projectId, updateData, currentUser) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new ApiError(400, 'Invalid Project ID format');
        }

        const project = await Project.findById(projectId);

        if (!project) {
            throw new ApiError(404, 'Project not found');
        }

        const isOwner = project.owner.toString() === currentUser._id.toString();
        const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(currentUser.role);

        if (!isOwner && !isAdminOrManager) {
            throw new ApiError(403, 'You do not have permission to update this project');
        }

        const allowedUpdates = [
            'name',
            'description',
            'status',
            'members',
            'startDate',
            'endDate'
        ];

        allowedUpdates.forEach((field) => {
            if (updateData[field] !== undefined) {
                project[field] = updateData[field];
            }
        });

        await project.save();

        return await project.populate([
            { path: 'owner', select: 'firstName lastName email role' },
            { path: 'members', select: 'firstName lastName email role' },
        ]);

    }
}