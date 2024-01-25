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
exports.getCourseWithFilteringController = exports.getCourseWithReview = exports.updateCourseController = exports.getBestCourseController = exports.createCourseController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const findWeeks_1 = require("../../utils/findWeeks");
const course_validation_1 = require("./course.validation");
const course_services_1 = require("./course.services");
const course_model_1 = require("./course.model");
const reviews_services_1 = require("../review/reviews.services");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const verifyJwt_1 = require("../../middleWares/verifyJwt");
// the controller for creating new course
exports.createCourseController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const { _id, role, email } = yield (0, verifyJwt_1.verifyJwt)(token);
    if (role !== "admin") {
        throw new appError_1.default("Unauthorized Access", {
            message: "You do not have the necessary permissions to access this resource.",
        });
    }
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const durationInWeeks = (0, findWeeks_1.findWeeks)(startDate, endDate);
    const body = Object.assign(Object.assign({}, req.body), { durationInWeeks, createdBy: _id });
    const { value, error } = course_validation_1.JoiCourseSchema.validate(body);
    if (error) {
        throw new appError_1.default("JOI", error);
    }
    const result = yield (0, course_services_1.createCourseService)(value);
    const data = yield (0, course_services_1.getOneCourseService)(result === null || result === void 0 ? void 0 : result._id);
    res.status(200).json({
        success: true,
        statusCode: 201,
        message: "Course created successfully",
        data: data,
    });
}));
// getting best course based on the average rating
exports.getBestCourseController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, course_services_1.getBestCourseService)();
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Best course retrieved successfully",
        data: result,
    });
}));
// the controller to update the course in a a collection dynamically.
exports.updateCourseController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.headers.authorization;
    const { _id, email, role } = yield (0, verifyJwt_1.verifyJwt)(token);
    if (role !== "admin") {
        throw new appError_1.default("Unauthorized Access", {
            message: "You do not have the necessary permissions to access this resource.",
        });
    }
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.courseId;
    let body;
    if (req.body.startDate && req.body.endDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const durationInWeeks = (0, findWeeks_1.findWeeks)(startDate, endDate);
        body = Object.assign(Object.assign({}, req.body), { durationInWeeks });
    }
    else {
        body = req.body;
    }
    const { value, error } = course_validation_1.JoiCoursePartialSchema.validate(body);
    if (error) {
        throw new appError_1.default("JOI", error);
    }
    const response = yield (0, course_services_1.updateCourseService)(id, value);
    res.status(201).json({
        success: true,
        statusCode: 200,
        message: "Course updated successfully",
        data: response,
    });
}));
// getting one course including all its reviews.
exports.getCourseWithReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const course = yield course_model_1.courseModel
        .findOne({ _id: (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.courseId })
        .select({
        _id: 1,
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        "tags.name": 1,
        "tags.isDeleted": 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        durationInWeeks: 1,
        "details.level": 1,
        "details.description": 1,
        createdAt: 1,
        updatedAt: 1,
    })
        .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
    });
    const reviews = yield (0, reviews_services_1.getReviewsByCourse)((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.courseId);
    const result = {
        course,
        reviews,
    };
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Course and Reviews retrieved successfully",
        data: result,
    });
}));
// the controller to filter courses based on different queries
exports.getCourseWithFilteringController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { meta, courses } = yield (0, course_services_1.getCoursesService)(req === null || req === void 0 ? void 0 : req.query);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Courses retrieved successfully",
        meta: meta,
        data: {
            courses: courses,
        },
    });
}));
