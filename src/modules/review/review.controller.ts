import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { createReviewService } from "./reviews.services";
import { JoiReviewSchema } from "./review.validation";
import AppError from "../../errorHandlers/appError";
import httpStatus from "http-status";
import { verifyJwt } from "../../middleWares/verifyJwt";

export const createReviewController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string | any = req.headers.authorization;
    const { email, role, _id } = await verifyJwt(token);
    if (role !== "user") {
      throw new AppError("Unauthorized Access", {
        message:
          "You do not have the necessary permissions to access this resource.",
      });
    }

    const body = { ...req?.body, createdBy: _id };

    const { value, error } = JoiReviewSchema.validate(body);

    if (error) {
      throw new AppError("JOI", error);
    }

    const result: any = await createReviewService(value);
    const data: any = result.toObject();
    delete data?.__v;

    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "Review created successfully",
      data: data,
    });
  }
);
