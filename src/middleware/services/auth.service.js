import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken } from "../../utils/jwt.js";


export class AuthService {
    static async registerUser(userData) {
        const { firstName, lastName, email, password } = userData;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(409, 'User with this email already exists');
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        return user;
    }


    static async loginUser({email, password}){
        // 1. Find User
        const user = await User.findOne({email}).select('+password');

        // 2. Check User exists
        if(!user){
            throw new ApiError(401, 'Invalid email or password');
        }

        // 3. check isActive
        if(!user.isActive){
            throw new ApiError(403, 'Your account is deactivated. Please contact support.');
        }

        // 4. Compare Password
        // const isPasswordValid = await user.comparePassword(password);
        // if(!isPasswordValid){
        //     throw new ApiError(401, 'Invalid email or password');
        // }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            throw new ApiError(401, 'Invalid email or password');
        }


        // 5. Generate JWT
        const accessToken = generateAccessToken(user);

        // 6. Return authentication response payload
        const userJson = user.toJSON();

        return {
            user: userJson,
            accessToken,
        };
    }
}
