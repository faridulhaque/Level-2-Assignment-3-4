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
exports.getCategoriesController = exports.createCategoryController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const category_services_1 = require("./category.services");
const category_validation_1 = require("./category.validation");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const verifyJwt_1 = require("../../middleWares/verifyJwt");
// controller function for creating a category
exports.createCategoryController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const { _id, role, email } = yield (0, verifyJwt_1.verifyJwt)(token);
    if (role !== "admin") {
        throw new appError_1.default("Unauthorized Access", {
            message: "You do not have the necessary permissions to access this resource first.",
        });
    }
    const body = Object.assign(Object.assign({}, req.body), { createdBy: _id });
    const { error, value } = category_validation_1.JoiCategorySchema.validate(body);
    if (error) {
        throw new appError_1.default("JOI", error);
    }
    const result = yield (0, category_services_1.createCategoryService)(value);
    const data = result.toObject();
    data === null || data === void 0 ? true : delete data.__v;
    res.status(200).json({
        success: true,
        statusCode: 201,
        message: "Category created successfully",
        data: data,
    });
}));
// controller function for all categories.
exports.getCategoriesController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, category_services_1.getCategoriesService)();
    const data = { categories };
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Categories retrieved successfully",
        data,
    });
}));
