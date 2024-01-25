"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesRoutes = void 0;
const express_1 = require("express");
const course_controller_1 = require("../modules/course/course.controller");
exports.coursesRoutes = (0, express_1.Router)();
exports.coursesRoutes.get("", course_controller_1.getCourseWithFilteringController);
exports.coursesRoutes.get("/:courseId/reviews", course_controller_1.getCourseWithReview);
exports.coursesRoutes.put("/:courseId", course_controller_1.updateCourseController);
exports.coursesRoutes.post("/", course_controller_1.createCourseController);