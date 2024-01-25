import { Schema, model } from "mongoose";
import { TCourse, TDetails, TTags } from "./course.interfaces";
import AppError from "../../errorHandlers/appError";
import { categoryModel } from "../category/category.model";
import { UserModel } from "../user/user.model";

// mongoose models for course collection

export const MTagsSchema = new Schema<TTags>({
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: false,
  },
});

export const MDetailsSchema = new Schema<TDetails>({
  level: {
    type: String,
    enum: ["Beginner", "Advanced", "Intermediate"],
  },
  description: {
    type: String,
    required: true,
  },
});

export const MCourseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    tags: {
      type: [MTagsSchema],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },

    durationInWeeks: {
      type: Number,
      required: true,
    },
    details: MDetailsSchema,
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },

  {
    timestamps: true, 
  }
);

// handling uniqueness of the title and existence of the category before saving

MCourseSchema.pre("save", async function (next) {
  const notUniqueTitle = await courseModel.findOne({
    title: this.title,
  });

  if (notUniqueTitle) {
    throw new AppError("preCheck", { message: "Title already exists" });
  }

  const categoryIdMatch = await categoryModel.findOne({
    _id: this.categoryId,
  });
  if (!categoryIdMatch?._id) {
    throw new AppError("preCheck", { message: "CategoryId does not exist" });
  }

  const userIdMatch = await UserModel.findOne({
    _id: this.createdBy,
  });

  if (!userIdMatch) {
    throw new AppError("preCheck", { message: "User does not exist" });
  }

  next();
});

export const courseModel = model<TCourse>("Course", MCourseSchema);
