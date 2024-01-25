import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errorHandlers/appError";
import jwt from "jsonwebtoken";
import {
  JoiChangePassword,
  JoiLoginUserSchema,
  JoiUserSchema,
} from "./user.validation";
import {
  changePasswordService,
  createUserService,
  loginUserService,
} from "./user.services";
import { UserModel } from "./user.model";
import bcrypt from "bcrypt";
import { verifyJwt } from "../../middleWares/verifyJwt";

// creating a user 

export const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = JoiUserSchema.validate(req?.body);

    if (error) {
      throw new AppError("JOI", error);
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req?.body?.password, salt);
    value.password = passwordHash;

    const result: any = await createUserService(value);

    const data: any = result.toObject();
    delete data?.__v;
    delete data?.password;

    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: data,
    });
  }
);

// user logging in controller
export const userLoginController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = JoiLoginUserSchema.validate(req.body);

    if (error) {
      throw new AppError("JOI", error);
    }

    const username = value.username;
    const password = value.password;

    const result: any = await loginUserService(username, password);

    const data: any = result?.user?.toObject();
    delete data?.__v;
    delete data?.password;
    delete data?.createdAt;
    delete data?.updatedAt;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User login successful",
      data: {
        user: data,
        token: result?.token,
      },
    });
  }
);
// change password 
export const changePasswordController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const token: string | any = req.headers.authorization;

    if (!token) {
      throw new AppError("Unauthorized Access", {
        message:
          "You do not have the necessary permissions to access this resource.",
      });
    }

    const {_id }:any = await verifyJwt(token);


    const { value, error } = JoiChangePassword.validate(req.body);
    if (error) {
      throw new AppError("JOI", error);
    }

    const result: any = await changePasswordService(
      value.currentPassword,
      value.newPassword,
      _id,
    );


    const data: any = result.toObject();
    delete data?.__v;
    delete data?.password;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
      data: data,
    });
  }
);
