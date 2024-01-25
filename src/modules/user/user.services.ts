import bcrypt from "bcrypt";
import { TUser } from "./user.interfaces";
import { UserModel } from "./user.model";
import jwt from "jsonwebtoken";
import { passwordModel } from "../password/password.model";
import AppError from "../../errorHandlers/appError";
import moment from "moment";

// service function for create user

export const createUserService = async (data: TUser) => {
  const user: any = await UserModel.create(data);

  return user;
};

// service function for logging In

export const loginUserService = async (username: string, password: string) => {
  const user: any = await UserModel.findOne({ username });
  if (user === null) {
    throw new AppError("auth", {
      message: `There is no user with this username`,
    });
  }

  const isMatched = await bcrypt.compare(password, user?.password);
  if (!isMatched) {
    throw new AppError("auth", {
      message: `Password did not match`,
    });
  }

  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
      iat: Math.floor(Date.now()),
      exp: Math.floor(Date.now()),
    },
    process.env.JWT_SECRET as string
  );

  return {
    user,
    token,
  };
};

// service function for changing password
export const changePasswordService = async (
  currentPassword: string,
  newPassword: string,
  _id: string
) => {
  const user = await UserModel.findOne({
    _id,
  });

  const userPassword: string | any = user?.password;
  const isPasswordMatch = await bcrypt.compare(currentPassword, userPassword);

  if (!isPasswordMatch) {
    throw new AppError("auth", {
      message: `Current password did not match`,
    });
  }

  const lastPasswords: any = await passwordModel.find({ userId: _id }).select({
    value: 1,
    updatedAt: 1,
  });

  let matchedOne: any = {};

  for (let i = 0; i < lastPasswords.length; i++) {
    const existingPass = lastPasswords[i].value;
    if (await bcrypt.compare(newPassword, existingPass)) {
      matchedOne = lastPasswords[i];
      break;
    }
  }

  if (matchedOne?._id) {
    throw new AppError("auth", {
      message: `Password change failed. Ensure the new password is unique and not among the last 2 used. (last used on ${moment(
        matchedOne?.updatedAt
      ).format("YYYY-MM-DD [at] hh:mm A")}).`,
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await UserModel.updateOne(
    {
      _id: _id,
    },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );

  if ((await passwordModel.countDocuments({ _id })) < 3) {
    passwordModel.create({
      userId: _id,
      value: hashedPassword,
    });
  } else {
    await passwordModel.findOneAndDelete(
      { userId: _id },
      { sort: { createdAt: 1 } }
    );
    await passwordModel.create({
      userId: _id,
      value: hashedPassword,
    });
  }
  const updateUser = await UserModel.findOne({ _id });
  return updateUser;
};

// const getOneUserService = async (_id:string) => {
//   const updateUser = await UserModel.findOne({ _id }).select({

//   });

// }
