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
exports.categoryModel = exports.MCategorySchema = void 0;
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const user_model_1 = require("../user/user.model");
// all necessary mongoose models for category collection
exports.MCategorySchema = new mongoose_1.Schema({
    name: {
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
exports.MCategorySchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isCategoryExists = yield exports.categoryModel.findOne({
            name: this.name,
        });
        if (isCategoryExists) {
            throw new appError_1.default("preCheck", { message: "Category already exists" });
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
exports.categoryModel = (0, mongoose_1.model)("Category", exports.MCategorySchema);
