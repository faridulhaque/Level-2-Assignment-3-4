import Joi from "joi";

// Mandatory validation schema for creation

const JoiTagsSchema = Joi.object({
  name: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
}).options({ abortEarly: false });

const JoiDetailsSchema = Joi.object({
  level: Joi.string().valid("Beginner", "Advanced", "Intermediate").required(),
  description: Joi.string().required(),
}).options({ abortEarly: false });

export const JoiCourseSchema = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.string().required(),
  instructor: Joi.string().required(),
  price: Joi.number().required(),
  tags: Joi.array().items(JoiTagsSchema).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  language: Joi.string().required(),
  provider: Joi.string().required(),
  durationInWeeks: Joi.number().required(),
  details: JoiDetailsSchema.required(),
  createdBy: Joi.string().required(),
}).options({ abortEarly: false });


//partial validation schema for update

const JoiTagsPartialSchema = Joi.object({
  name: Joi.string().optional(),
  isDeleted: Joi.boolean().optional(),
}).options({ abortEarly: false });

const JoiDetailsPartialSchema = Joi.object({
  level: Joi.string().valid("Beginner", "Advanced", "Intermediate").optional(),
  description: Joi.string().optional(),
}).options({ abortEarly: false });

export const JoiCoursePartialSchema = Joi.object({
  title: Joi.string().optional(),
  categoryId: Joi.string().optional(),
  instructor: Joi.string().optional(),
  price: Joi.number().optional(),
  tags: Joi.array().items(JoiTagsPartialSchema).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  language: Joi.string().optional(),
  provider: Joi.string().optional(),
  durationInWeeks: Joi.number().optional(),
  details: JoiDetailsPartialSchema.optional(),
  createdBy: Joi.string().optional(),
}).options({ abortEarly: false });
