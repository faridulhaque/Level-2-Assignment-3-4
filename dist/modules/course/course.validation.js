"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiCoursePartialSchema = exports.JoiCourseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Mandatory validation schema for creation
const JoiTagsSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    isDeleted: joi_1.default.boolean().optional(),
}).options({ abortEarly: false });
const JoiDetailsSchema = joi_1.default.object({
    level: joi_1.default.string().valid("Beginner", "Advanced", "Intermediate").required(),
    description: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.JoiCourseSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.string().required(),
    instructor: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    tags: joi_1.default.array().items(JoiTagsSchema).required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
    language: joi_1.default.string().required(),
    provider: joi_1.default.string().required(),
    durationInWeeks: joi_1.default.number().required(),
    details: JoiDetailsSchema.required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
//partial validation schema for update
const JoiTagsPartialSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    isDeleted: joi_1.default.boolean().optional(),
}).options({ abortEarly: false });
const JoiDetailsPartialSchema = joi_1.default.object({
    level: joi_1.default.string().valid("Beginner", "Advanced", "Intermediate").optional(),
    description: joi_1.default.string().optional(),
}).options({ abortEarly: false });
exports.JoiCoursePartialSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    categoryId: joi_1.default.string().optional(),
    instructor: joi_1.default.string().optional(),
    price: joi_1.default.number().optional(),
    tags: joi_1.default.array().items(JoiTagsPartialSchema).optional(),
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().optional(),
    language: joi_1.default.string().optional(),
    provider: joi_1.default.string().optional(),
    durationInWeeks: joi_1.default.number().optional(),
    details: JoiDetailsPartialSchema.optional(),
    createdBy: joi_1.default.string().optional(),
}).options({ abortEarly: false });
