"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("../modules/review/review.controller");
exports.reviewsRoutes = (0, express_1.Router)();
exports.reviewsRoutes.post("/", review_controller_1.createReviewController);
