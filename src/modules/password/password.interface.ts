import { Types } from "mongoose";

export type TPasswords = {
  value: string;
  userId: Types.ObjectId;
};
