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
exports.courseModel = exports.MCourseSchema = exports.MDetailsSchema = exports.MTagsSchema = void 0;
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const category_model_1 = require("../category/category.model");
const user_model_1 = require("../user/user.model");
// mongoose models for course collection
exports.MTagsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: false,
    },
});
exports.MDetailsSchema = new mongoose_1.Schema({
    level: {
        type: String,
        enum: ["Beginner", "Advanced", "Intermediate"],
    },
    description: {
        type: String,
        required: true,
    },
});
exports.MCourseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    tags: {
        type: [exports.MTagsSchema],
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    durationInWeeks: {
        type: Number,
        required: true,
    },
    details: exports.MDetailsSchema,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
// handling uniqueness of the title and existence of the category before saving
exports.MCourseSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const notUniqueTitle = yield exports.courseModel.findOne({
            title: this.title,
        });
        if (notUniqueTitle) {
            throw new appError_1.default("preCheck", { message: "Title already exists" });
        }
        const categoryIdMatch = yield category_model_1.categoryModel.findOne({
            _id: this.categoryId,
        });
        if (!(categoryIdMatch === null || categoryIdMatch === void 0 ? void 0 : categoryIdMatch._id)) {
            throw new appError_1.default("preCheck", { message: "CategoryId does not exist" });
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
exports.courseModel = (0, mongoose_1.model)("Course", exports.MCourseSchema);
