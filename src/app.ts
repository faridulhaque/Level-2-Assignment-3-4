import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { categoryRoutes } from "./routes/categories.routes";
import { courseRoutes } from "./routes/course.routes";
import { reviewsRoutes } from "./routes/reviews.routes";
import { coursesRoutes } from "./routes/courses.routes";
import { globalErrorHandler } from "./errorHandlers/globalErrorHandler";
import { authRoutes } from "./routes/auth.routes";
import mongoose from "mongoose";

const app: Application = express();

app.use(express.json());

// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/reviews", reviewsRoutes);

app.use(globalErrorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(200).json({ message: "no route found" });
});

export default app;
