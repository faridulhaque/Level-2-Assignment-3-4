"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("../modules/category/category.controller");
exports.categoryRoutes = (0, express_1.Router)();
exports.categoryRoutes.post("/", category_controller_1.createCategoryController);
exports.categoryRoutes.get("/", category_controller_1.getCategoriesController);
