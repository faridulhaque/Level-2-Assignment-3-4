"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.MUserSchema = void 0;
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const password_model_1 = require("../password/password.model");
exports.MUserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
}, {
    timestamps: true,
});
exports.MUserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const nonUniqueUsername = yield exports.UserModel.findOne({
            username: this.username,
        });
        if (nonUniqueUsername) {
            throw new appError_1.default("preCheck", { message: "Username already in use" });
        }
        const nonUniqueEmail = yield exports.UserModel.findOne({
            email: this.email,
        });
        if (nonUniqueEmail) {
            throw new appError_1.default("preCheck", { message: "Email already in use" });
        }
        next();
    });
});
exports.MUserSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield password_model_1.passwordModel.create({
            userId: doc._id,
            value: doc.password,
        });
        next();
    });
});
exports.UserModel = (0, mongoose_1.model)("User", exports.MUserSchema);
