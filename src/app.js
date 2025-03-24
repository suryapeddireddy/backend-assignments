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
import suscriptionRoutes from '../routes/subscription.routes.js'
import likeRoutes from '../routes/like.routes.js'
import commentRoutes from '../routes/comment.routes.js'

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/subscriptions",suscriptionRoutes);
app.use('/api/v1/likes',likeRoutes);
app.use('/api/v1/comments',commentRoutes);
export default app;
