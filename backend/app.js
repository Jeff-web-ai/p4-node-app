import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import helment from "helmet";

dotenv.config();

// db
import connectDB from "./utils/db.js";

// middleware
import { ErrorMiddleware } from "./middlewares/error.js";

// routes
import licenseRouter from "./routes/license.route.js";
import subjectRouter from "./routes/subject.route.js";
import userRouter from "./routes/user.route.js";
import materialRouter from "./routes/material.route.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Body parser middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(helment());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Connect to the database and start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

// Route definitions
app.use("/api/v1", licenseRouter, subjectRouter, userRouter, materialRouter);

// API testing endpoint
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Api is working",
  });
});

// Unknown route
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);
