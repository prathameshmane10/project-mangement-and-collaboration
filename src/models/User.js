import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MANGER: 'MANAGER',
    MEMBER: 'MEMBER',
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Normalizes email to lowercase
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false, // Ensures password is excluded from query results by default
    },
    role: {
        type: String,
        enum: {
            values: Object.values(ROLES),
            message: '{VALUE} is not a valid role',
        },
        default: ROLES.MEMBER,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// userSchema.methods.toJSON = function () {
//   const userObject = this.toObject();
//   delete userObject.password;
//   return userObject;
// };



export default mongoose.model('User', userSchema);
