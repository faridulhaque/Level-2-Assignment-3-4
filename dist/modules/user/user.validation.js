"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiChangePassword = exports.JoiLoginUserSchema = exports.JoiUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// all validation for user, password change
exports.JoiUserSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    role: joi_1.default.string().valid("admin", "user").optional(),
}).options({ abortEarly: false });
exports.JoiLoginUserSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.JoiChangePassword = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(8).required(),
});
