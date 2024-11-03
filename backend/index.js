import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import cron from "node-cron";

import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/user.js";
import roomRoutes from "./routers/room.js";
import roomTypeRoutes from "./routers/roomType.js";
import bookingRoutes from "./routers/booking.js";
import uploadRoutes from "./routers/upload.js";
import reviewRoutes from "./routers/review.js";
import { scheduleUpdateBooking } from "./controllers/booking.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "*",
    })
);

cron.schedule('*/15 * * * *', async () => {
    console.log('Running a task every 15 minutes');
    await scheduleUpdateBooking();
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/roomtypes", roomTypeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/uploads", uploadRoutes);

app.listen(8080, () => {
    console.log("server running on localhost:8080");
});
