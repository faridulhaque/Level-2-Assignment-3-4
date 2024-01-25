import Joi from "joi"
export const JoiReviewSchema = Joi.object({
  courseId: Joi.string().required(),
  rating: Joi.number().required(),
  review: Joi.string().required(),
  createdBy: Joi.string().required(),
}).options({ abortEarly: false });


