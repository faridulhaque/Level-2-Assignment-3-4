import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { findWeeks } from "../../utils/findWeeks";
import { JoiCoursePartialSchema, JoiCourseSchema } from "./course.validation";
import {
  createCourseService,
  getBestCourseService,
  getCoursesService,
  getOneCourseService,
  updateCourseService,
} from "./course.services";
import { courseModel } from "./course.model";
import { getReviewsByCourse } from "../review/reviews.services";
import AppError from "../../errorHandlers/appError";
import httpStatus from "http-status";
import { TCourse } from "./course.interfaces";
import { verifyJwt } from "../../middleWares/verifyJwt";

// the controller for creating new course
export const createCourseController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string | any = req.headers.authorization;

    const { _id, role, email }: any = await verifyJwt(token);

    if (role !== "admin") {
      throw new AppError("Unauthorized Access", {
        message:
          "You do not have the necessary permissions to access this resource.",
      });
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const durationInWeeks: number = findWeeks(startDate, endDate);
    const body = { ...req.body, durationInWeeks, createdBy: _id };

    const { value, error } = JoiCourseSchema.validate(body);

    if (error) {
      throw new AppError("JOI", error);
    }

    const result: any = await createCourseService(value);

    const data = await getOneCourseService(result?._id);

    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "Course created successfully",
      data: data,
    });
  }
);

// getting best course based on the average rating
export const getBestCourseController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await getBestCourseService();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Best course retrieved successfully",
      data: result,
    });
  }
);

// the controller to update the course in a a collection dynamically.
export const updateCourseController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string | any = req.headers.authorization;
    const { _id, email, role } = await verifyJwt(token);

    if (role !== "admin") {
      throw new AppError("Unauthorized Access", {
        message:
          "You do not have the necessary permissions to access this resource.",
      });
    }

    const id = req?.params?.courseId;

    let body: Partial<TCourse>;

    if (req.body.startDate && req.body.endDate) {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);

      const durationInWeeks: number = findWeeks(startDate, endDate);
      body = { ...req.body, durationInWeeks };
    } else {
      body = req.body;
    }
    const { value, error } = JoiCoursePartialSchema.validate(body);

    if (error) {
      throw new AppError("JOI", error);
    }

    const response = await updateCourseService(id, value);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Course updated successfully",
      data: response,
    });
  }
);

// getting one course including all its reviews.
export const getCourseWithReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await courseModel
      .findOne({ _id: req?.params?.courseId })
      .select({
        _id: 1,
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        "tags.name": 1,
        "tags.isDeleted": 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        durationInWeeks: 1,
        "details.level": 1,
        "details.description": 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
      });
    const reviews = await getReviewsByCourse(req?.params?.courseId);

    const result = {
      course,
      reviews,
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Course and Reviews retrieved successfully",
      data: result,
    });
  }
);

// the controller to filter courses based on different queries

export const getCourseWithFilteringController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { meta, courses } = await getCoursesService(req?.query);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Courses retrieved successfully",
      meta: meta,
      data: {
        courses: courses,
      },
    });
  }
);
