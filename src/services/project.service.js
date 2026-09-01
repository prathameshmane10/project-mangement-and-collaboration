// import Project from "../../models/Project.js";
import Project from '../models/Project.js'

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
        const { page = 1, limit = 10, search, status, sort='-createdAt' } = queryParams;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
    }
}