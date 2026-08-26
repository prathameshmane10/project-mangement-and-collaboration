import mongoose from "mongoose";

const connectToDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
}

export default connectToDB;
