"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const categories_routes_1 = require("./routes/categories.routes");
const course_routes_1 = require("./routes/course.routes");
const reviews_routes_1 = require("./routes/reviews.routes");
const courses_routes_1 = require("./routes/courses.routes");
const globalErrorHandler_1 = require("./errorHandlers/globalErrorHandler");
const auth_routes_1 = require("./routes/auth.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };
app.use((0, cors_1.default)());
app.use("/api/auth", auth_routes_1.authRoutes);
app.use("/api/courses", courses_routes_1.coursesRoutes);
app.use("/api/categories", categories_routes_1.categoryRoutes);
app.use("/api/course", course_routes_1.courseRoutes);
app.use("/api/reviews", reviews_routes_1.reviewsRoutes);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use("*", (req, res) => {
    res.status(200).json({ message: "no route found" });
});
exports.default = app;
