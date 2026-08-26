import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectToDB from "./config/database.js";

const port = process.env.PORT;
const node_env = process.env.NODE_ENV;

const startServer = async () =>{
    try{
        await connectToDB();
        app.listen(port, () => {
            console.log("Server is running port", port);
        });
    } catch (error){
        console.error("Failed to start server", error.message);
        process.exit(1);
    }
}

startServer();
