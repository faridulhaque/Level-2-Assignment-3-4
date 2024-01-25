import { Schema, model } from "mongoose";
import { TUser } from "./user.interfaces";
import AppError from "../../errorHandlers/appError";
import { passwordModel } from "../password/password.model";

export const MUserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

MUserSchema.pre("save", async function (next) {
  const nonUniqueUsername = await UserModel.findOne({
    username: this.username,
  });

  if (nonUniqueUsername) {
    throw new AppError("preCheck", { message: "Username already in use" });
  }

  const nonUniqueEmail = await UserModel.findOne({
    email: this.email,
  });

  if (nonUniqueEmail) {
    throw new AppError("preCheck", { message: "Email already in use" });
  }
  next();
});

MUserSchema.post("save", async function (doc, next) {
  await passwordModel.create({
    userId: doc._id,
    value: doc.password,
  });
  next();
});

export const UserModel = model<TUser>("User", MUserSchema);
