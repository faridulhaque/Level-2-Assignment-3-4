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
exports.getReviewsByCourse = exports.createReviewService = void 0;
const review_model_1 = require("./review.model");
const createReviewService = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield review_model_1.ReviewModel.create(value);
    const result = yield review_model_1.ReviewModel.findOne({ _id: response === null || response === void 0 ? void 0 : response._id }).populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
    });
    return result;
});
exports.createReviewService = createReviewService;
const getReviewsByCourse = (courseId) => {
    const response = review_model_1.ReviewModel.find({ courseId })
        .select({
        courseId: 1,
        review: 1,
        rating: 1,
        _id: 0,
    })
        .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
    });
    return response;
};
exports.getReviewsByCourse = getReviewsByCourse;
