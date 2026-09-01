import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export class Userservice {
    static async createUser(userdata) {
        const { firstName, lastName, email, password, role, isActive } = userdata;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(409, 'User with this email already exists');
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            isActive
        });

        // return await user.populate('firstname');
    }

    static async getUser(queryparams) {
        const {page =1, limit = 10, search, role, isActive, sort = '-createdAt'} = queryparams;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum -1) * limitNum;

        const query = {};

        if(role){
            query.role = role.toUpperCase();
        }

        if(isActive){
            query.isActive = isActive === 'true';
        }

        if(search){
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if(!['firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'].includes(sort.replace('-', ''))){
            throw new ApiError(400, `Invalid sort field: ${sort}`);
        }

        const sortBy = sort.split(',').join(' ');

        const [users, totalUsers] = await Promise.all([
            User.find(query).sort(sortBy).skip(skip).limit(limitNum),
            User.countDocuments(query)      
        ]);
        
        const totalPages = Math.ceil(totalUsers / limitNum);
        return {
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: pageNum,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        };
    }
            

}