import express from 'express';
import { getBestCourseController, updateCourseController } from '../modules/course/course.controller';


export const courseRoutes = express.Router();


courseRoutes.get("/best", getBestCourseController)