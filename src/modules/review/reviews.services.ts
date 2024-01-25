import { NextFunction, Response } from "express";
import { ReviewModel } from "./review.model";
import { TReview } from "./review.interfaces";

export const createReviewService = async (value: TReview) => {
  const response = await ReviewModel.create(value);
  const result = await ReviewModel.findOne({ _id: response?._id }).populate({
    path: "createdBy",
    model: "User",
    select: "username email _id role",
  });
  return result;
};

export const getReviewsByCourse = (courseId: string) => {
  const response = ReviewModel.find({ courseId })
    .select({
      courseId: 1,
      review: 1,
      rating: 1,
      _id: 0,
    })
    .populate({
      path: "createdBy",
      model: "User",
      select: "username email _id role",
    });

  return response;
};
