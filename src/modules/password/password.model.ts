import { Schema, model } from "mongoose";
import { TPasswords } from "./password.interface";

export const MPasswordSchema = new Schema<TPasswords>(
  {
    value: {
      type: String,
      required: true,
      default: ""
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const passwordModel = model<TPasswords>("password", MPasswordSchema);
