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
}