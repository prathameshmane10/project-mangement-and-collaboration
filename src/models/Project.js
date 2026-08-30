import mongoose from "mongoose";

export const PROJECT_STATUS = {
    PLANNED: 'PLANNED',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    ARCHIVED: 'ARCHIVED',
};


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: [100, 'Project name cannot exceed 100 characters'],
    },

    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: '',
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project owner is required'],
        index: true,
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    status: {
        type: String,
        enum: {
            values: Object.values(PROJECT_STATUS),
            message: '{VALUE} is not a valid project status',
        },
        default: PROJECT_STATUS.PLANNED,
        index: true,
    },
    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || !this.startDate || value >= this.startDate;
            },
            message: 'End date must be greater than or equal to start date',
        },
    },
},
    {
        timestamps: true,
    }
);


projectSchema.index({ owner: 1, status: 1 });

export default mongoose.model("Project", projectSchema);