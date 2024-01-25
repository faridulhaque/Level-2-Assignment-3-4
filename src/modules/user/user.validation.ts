import Joi from "joi";

// all validation for user, password change
export const JoiUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("admin", "user").optional(),
}).options({ abortEarly: false });

export const JoiLoginUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const JoiChangePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});
