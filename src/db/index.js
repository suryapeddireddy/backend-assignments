import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import app from "../app.js";


const connectDB = async () => {
try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log('Database connected!');
} catch (error) {
    console.log(process.env.MONGODB_URI);
    console.error(`Error connecting to the database: ${error.message}`);
}
};

export default connectDB;
