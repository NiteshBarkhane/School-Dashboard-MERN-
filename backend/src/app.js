import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://school-dashboard-backend-wgp2.onrender.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// Import routers
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import teacherRouter from "./routes/teacher.route.js";
import studentRouter from "./routes/student.route.js";
import departmentRouter from "./routes/department.route.js";
import classRouter from "./routes/class.route.js";
import scheduleRouter from "./routes/schedule.route.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

// Declare routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", verifyToken,adminRouter);
app.use("/api/v1/teacher",verifyToken, teacherRouter);
app.use("/api/v1/student",verifyToken, studentRouter);
// app.use("/api/v1/department", departmentRouter); //we are not using department
app.use("/api/v1/class",verifyToken, classRouter);
app.use("/api/v1/schedule",verifyToken, scheduleRouter);

// Global/Centralized error response handler
app.use((err, req, res, next) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode,
    success: err.success || false,
    message: err.message || "Internal Server Error",
  });
});

export { app };
