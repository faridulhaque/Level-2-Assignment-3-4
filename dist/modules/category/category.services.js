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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesService = exports.createCategoryService = void 0;
const category_model_1 = require("./category.model");
// service function for create a category.
const createCategoryService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield category_model_1.categoryModel.create(data);
    return response;
});
exports.createCategoryService = createCategoryService;
// service function to get all categories
const getCategoriesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield category_model_1.categoryModel
        .find()
        .select({
        _id: 1,
        name: 1,
    })
        .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
    });
    return response;
});
exports.getCategoriesService = getCategoriesService;
