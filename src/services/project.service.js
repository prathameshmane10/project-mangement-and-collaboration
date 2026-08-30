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
}