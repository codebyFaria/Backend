import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const DB_Connection = async () => {
    try {
       const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log("Database connected successfully");
        console.log("Connection details:", connection.connection.host);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

export default DB_Connection;