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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneCourseService = exports.getCoursesService = exports.updateCourseService = exports.getBestCourseService = exports.createCourseService = void 0;
const mongoose_1 = require("mongoose");
const review_model_1 = require("../review/review.model");
const course_model_1 = require("./course.model");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
// service function for create a course
const createCourseService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield course_model_1.courseModel.create(data);
    return response;
});
exports.createCourseService = createCourseService;
const getBestCourseService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const response = yield review_model_1.ReviewModel.aggregate([
        {
            $group: {
                _id: "$courseId",
                reviewCount: { $sum: 1 },
                averageRating: { $avg: "$rating" },
            },
        },
        {
            $sort: { averageRating: -1 },
        },
        {
            $limit: 1,
        },
        {
            $project: {
                _id: 0,
                courseId: "$_id",
                reviewCount: 1,
                averageRating: 1,
            },
        },
    ]);
    if (response === null || response === void 0 ? void 0 : response.length) {
        const courseId = (_a = response[0]) === null || _a === void 0 ? void 0 : _a.courseId;
        const averageRating = (_b = response[0]) === null || _b === void 0 ? void 0 : _b.averageRating;
        const reviewCount = (_c = response[0]) === null || _c === void 0 ? void 0 : _c.reviewCount;
        const course = yield course_model_1.courseModel
            .findOne({ _id: courseId })
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
        const data = {
            course,
            averageRating,
            reviewCount,
        };
        return data;
    }
    return null;
});
exports.getBestCourseService = getBestCourseService;
// service function for updating a course partially/dynamically
const updateCourseService = (id, value) => __awaiter(void 0, void 0, void 0, function* () {
    const { details, tags } = value, others = __rest(value, ["details", "tags"]);
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        try {
            yield course_model_1.courseModel.findByIdAndUpdate(id, others, {
                session,
            });
        }
        catch (error) {
            yield session.abortTransaction();
            throw new appError_1.default("MONGO", error);
        }
        if (details) {
            try {
                yield course_model_1.courseModel.findByIdAndUpdate(id, {
                    "details.level": details.level,
                    "details.description": details.description,
                }, { session });
            }
            catch (error) {
                yield session.abortTransaction();
                throw new appError_1.default("MONGO", error);
            }
        }
        if (tags === null || tags === void 0 ? void 0 : tags.length) {
            try {
                try {
                    yield course_model_1.courseModel.findOneAndUpdate({
                        _id: id,
                    }, {
                        $addToSet: { tags: { $each: tags } },
                    }, { new: true, session });
                }
                catch (error) {
                    throw new appError_1.default("MONGO", error);
                }
            }
            catch (error) {
                yield session.abortTransaction();
                throw new appError_1.default("MONGO", error);
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        const course = yield course_model_1.courseModel
            .findOne({ _id: id })
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
            updatedAt: 1,
            createdAt: 1,
        })
            .populate({
            path: "createdBy",
            model: "User",
            select: "username email _id role",
        });
        return course;
    }
    catch (error) {
        throw new appError_1.default("MONGO", error);
    }
});
exports.updateCourseService = updateCourseService;
// service function to get filtered course
const getCoursesService = (queries) => __awaiter(void 0, void 0, void 0, function* () {
    const { page: NPage, limit: NLimit, sortBy, sortOrder, minPrice, maxPrice, tags, startDate, endDate, language, provider, durationInWeeks, level, } = queries;
    const query = {};
    const page = NPage ? parseInt(NPage) : 1;
    const limit = NLimit ? parseInt(NLimit) : 10;
    const skip = (page - 1) * limit;
    if (startDate && endDate) {
        const sd = new Date(startDate);
        const ed = new Date(endDate);
        query.startDate = { $gte: sd, $lte: ed };
    }
    else if (startDate) {
        const sd = new Date(startDate);
        query.startDate = { $gte: sd };
    }
    else if (endDate) {
        const ed = new Date(endDate);
        query.endDate = { $lte: ed };
    }
    if (maxPrice && minPrice) {
        query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }
    else if (maxPrice) {
        query.price = { $lte: Number(maxPrice) };
    }
    else if (minPrice) {
        query.price = { $gte: Number(minPrice) };
    }
    if (language) {
        query.language = language;
    }
    if (provider) {
        query.provider = provider;
    }
    if (durationInWeeks) {
        query.durationInWeeks = Number(durationInWeeks);
    }
    if (level) {
        query["details.level"] = level;
    }
    if (tags) {
        query.tags = { $elemMatch: { name: tags } };
    }
    const courses = yield course_model_1.courseModel
        .find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .populate({
        path: "createdBy",
        model: "User",
        select: "username email _id role",
    })
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
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
    });
    const meta = {
        page,
        limit,
        total: courses === null || courses === void 0 ? void 0 : courses.length,
    };
    return { courses, meta };
});
exports.getCoursesService = getCoursesService;
//  a common function to use in different controllers and services
const getOneCourseService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield course_model_1.courseModel.findOne({ _id: id }).select({
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
        updatedAt: 1,
        createdAt: 1,
        createdBy: 1,
    });
    return response;
});
exports.getOneCourseService = getOneCourseService;
