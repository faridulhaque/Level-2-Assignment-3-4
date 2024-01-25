"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../modules/course/course.controller");
exports.courseRoutes = express_1.default.Router();
exports.courseRoutes.get("/best", course_controller_1.getBestCourseController);
