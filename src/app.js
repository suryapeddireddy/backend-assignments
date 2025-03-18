import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // ✅ Import cookie-parser

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true // ✅ Ensures cookies are sent from frontend
}));

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser()); // ✅ Middleware to parse cookies

// Secure routes
import userRoutes from "../routes/users.routes.js";
import videoRoutes from "../routes/video.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);

export default app;
