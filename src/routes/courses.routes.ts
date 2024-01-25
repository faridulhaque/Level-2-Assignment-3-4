import { Router } from "express";
import { createCourseController, getCourseWithFilteringController, getCourseWithReview, updateCourseController } from "../modules/course/course.controller";

export const coursesRoutes = Router()

coursesRoutes.get("", getCourseWithFilteringController)
coursesRoutes.get("/:courseId/reviews", getCourseWithReview)
coursesRoutes.put("/:courseId", updateCourseController)
coursesRoutes.post("/", createCourseController)



