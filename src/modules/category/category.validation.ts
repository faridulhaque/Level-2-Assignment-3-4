import Joi from "joi";

// validation for category schema with JOI
export const JoiCategorySchema = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.string().required(),
  
}).options({ abortEarly: false });
