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
exports.ReviewModel = exports.MReviewSchema = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = require("../course/course.model");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const user_model_1 = require("../user/user.model");
exports.MReviewSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
exports.MReviewSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const courseExists = yield course_model_1.courseModel.findOne({
            _id: this.courseId,
        });
        if (!courseExists) {
            throw new appError_1.default("preCheck", {
                message: "CourseId has not been found! add a valid courseId.",
            });
        }
        const userIdMatch = yield user_model_1.UserModel.findOne({
            _id: this.createdBy,
        });
        if (!userIdMatch) {
            throw new appError_1.default("preCheck", { message: "User does not exist" });
        }
        next();
    });
});
exports.ReviewModel = (0, mongoose_1.model)("Reviews", exports.MReviewSchema);
