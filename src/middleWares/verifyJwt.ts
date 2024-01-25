import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errorHandlers/appError";
import { UserModel } from "../modules/user/user.model";

export const verifyJwt = async (token: string) => {


  const jwtDecoded: any = jwt.verify(
    token as string,
    process.env.JWT_SECRET as string
  );

  const { _id, role, email } = jwtDecoded;
  const user = await UserModel.find({
    _id,
    role,
    email,
  });

  if (!user) {
    throw new AppError("Unauthorized Access", {
      message:
        "You do not have the necessary permissions to access this resource.",
    });
  }

  console.log(_id, role, email)
  return {
    _id,
    role,
    email,
  };
};
