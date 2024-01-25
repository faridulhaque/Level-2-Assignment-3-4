import { Schema, model } from "mongoose";
import { TCategory } from "./category.interfaces";
import AppError from "../../errorHandlers/appError";
import httpStatus from "http-status";
import { UserModel } from "../user/user.model";

// all necessary mongoose models for category collection

export const MCategorySchema = new Schema<TCategory>(
  {
    name: {
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

MCategorySchema.pre("save", async function (next) {
  const isCategoryExists = await categoryModel.findOne({
    name: this.name,
  });

  if (isCategoryExists) {
    throw new AppError("preCheck", { message: "Category already exists" });
  }

  const userIdMatch = await UserModel.findOne({
    _id: this.createdBy,
  });

  if (!userIdMatch) {
    throw new AppError("preCheck", { message: "User does not exist" });
  }
  next();
});

export const categoryModel = model<TCategory>("Category", MCategorySchema);
