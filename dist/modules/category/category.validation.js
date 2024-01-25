"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
// validation for category schema with JOI
exports.JoiCategorySchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
