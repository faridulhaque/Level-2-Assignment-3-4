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
exports.changePasswordController = exports.userLoginController = exports.registerUserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const user_validation_1 = require("./user.validation");
const user_services_1 = require("./user.services");
const bcrypt_1 = __importDefault(require("bcrypt"));
const verifyJwt_1 = require("../../middleWares/verifyJwt");
// creating a user 
exports.registerUserController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { value, error } = user_validation_1.JoiUserSchema.validate(req === null || req === void 0 ? void 0 : req.body);
    if (error) {
        throw new appError_1.default("JOI", error);
    }
    const salt = yield bcrypt_1.default.genSalt();
    const passwordHash = yield bcrypt_1.default.hash((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.password, salt);
    value.password = passwordHash;
    const result = yield (0, user_services_1.createUserService)(value);
    const data = result.toObject();
    data === null || data === void 0 ? true : delete data.__v;
    data === null || data === void 0 ? true : delete data.password;
    res.status(200).json({
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        data: data,
    });
}));
// user logging in controller
exports.userLoginController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { value, error } = user_validation_1.JoiLoginUserSchema.validate(req.body);
    if (error) {
        throw new appError_1.default("JOI", error);
    }
    const username = value.username;
    const password = value.password;
    const result = yield (0, user_services_1.loginUserService)(username, password);
    const data = (_b = result === null || result === void 0 ? void 0 : result.user) === null || _b === void 0 ? void 0 : _b.toObject();
    data === null || data === void 0 ? true : delete data.__v;
    data === null || data === void 0 ? true : delete data.password;
    data === null || data === void 0 ? true : delete data.createdAt;
    data === null || data === void 0 ? true : delete data.updatedAt;
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User login successful",
        data: {
            user: data,
            token: result === null || result === void 0 ? void 0 : result.token,
        },
    });
}));
// change password 
exports.changePasswordController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new appError_1.default("Unauthorized Access", {
            message: "You do not have the necessary permissions to access this resource.",
        });
    }
    const { _id } = yield (0, verifyJwt_1.verifyJwt)(token);
    const { value, error } = user_validation_1.JoiChangePassword.validate(req.body);
    if (error) {
        throw new appError_1.default("JOI", error);
    }
    const result = yield (0, user_services_1.changePasswordService)(value.currentPassword, value.newPassword, _id);
    const data = result.toObject();
    data === null || data === void 0 ? true : delete data.__v;
    data === null || data === void 0 ? true : delete data.password;
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Password changed successfully",
        data: data,
    });
}));
