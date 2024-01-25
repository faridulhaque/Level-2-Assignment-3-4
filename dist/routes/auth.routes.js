"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../modules/user/user.controller");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/register", user_controller_1.registerUserController);
exports.authRoutes.post("/login", user_controller_1.userLoginController);
exports.authRoutes.post("/change-password", user_controller_1.changePasswordController);
