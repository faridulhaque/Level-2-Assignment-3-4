import { Schema, model } from "mongoose";
import { TReview } from "./review.interfaces";
import { courseModel } from "../course/course.model";
import AppError from "../../errorHandlers/appError";
import { UserModel } from "../user/user.model";

export const MReviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MReviewSchema.pre("save", async function (next) {
  const courseExists = await courseModel.findOne({
    _id: this.courseId,
  });

  if (!courseExists) {
    throw new AppError("preCheck", {
      message: "CourseId has not been found! add a valid courseId.",
    });
  }

  const userIdMatch = await UserModel.findOne({
    _id: this.createdBy,
  });

  if (!userIdMatch) {
    throw new AppError("preCheck", { message: "User does not exist" });
  }

  next();
});

export const ReviewModel = model<TReview>("Reviews", MReviewSchema);
