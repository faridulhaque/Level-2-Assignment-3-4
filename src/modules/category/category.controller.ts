import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import {
  createCategoryService,
  getCategoriesService,
} from "./category.services";
import { JoiCategorySchema } from "./category.validation";
import AppError from "../../errorHandlers/appError";
import httpStatus from "http-status";
import { verifyJwt } from "../../middleWares/verifyJwt";

// controller function for creating a category

export const createCategoryController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string | any = req.headers.authorization;

    const { _id, role, email }: any = await verifyJwt(token);


    if (role !== "admin") {
      throw new AppError("Unauthorized Access", {
        message:
          "You do not have the necessary permissions to access this resource first.",
      });
    }

    const body = {...req.body, createdBy: _id}

    const { error, value } = JoiCategorySchema.validate(body);

    if (error) {
      throw new AppError("JOI", error);
    }

    const result: any = await createCategoryService(value);
    const data: any = result.toObject();
    delete data?.__v;
    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "Category created successfully",
      data: data,
    });
  }
);

// controller function for all categories.
export const getCategoriesController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await getCategoriesService();
    const data = {categories}

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Categories retrieved successfully",
      data,
    });
  }
);
