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
exports.changePasswordService = exports.loginUserService = exports.createUserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const password_model_1 = require("../password/password.model");
const appError_1 = __importDefault(require("../../errorHandlers/appError"));
const moment_1 = __importDefault(require("moment"));
// service function for create user
const createUserService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.create(data);
    return user;
});
exports.createUserService = createUserService;
// service function for logging In
const loginUserService = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ username });
    if (user === null) {
        throw new appError_1.default("auth", {
            message: `There is no user with this username`,
        });
    }
    const isMatched = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isMatched) {
        throw new appError_1.default("auth", {
            message: `Password did not match`,
        });
    }
    const token = jsonwebtoken_1.default.sign({
        _id: user._id,
        role: user.role,
        email: user.email,
        iat: Math.floor(Date.now()),
        exp: Math.floor(Date.now()),
    }, process.env.JWT_SECRET);
    return {
        user,
        token,
    };
});
exports.loginUserService = loginUserService;
// service function for changing password
const changePasswordService = (currentPassword, newPassword, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({
        _id,
    });
    const userPassword = user === null || user === void 0 ? void 0 : user.password;
    const isPasswordMatch = yield bcrypt_1.default.compare(currentPassword, userPassword);
    if (!isPasswordMatch) {
        throw new appError_1.default("auth", {
            message: `Current password did not match`,
        });
    }
    const lastPasswords = yield password_model_1.passwordModel.find({ userId: _id }).select({
        value: 1,
        updatedAt: 1,
    });
    let matchedOne = {};
    for (let i = 0; i < lastPasswords.length; i++) {
        const existingPass = lastPasswords[i].value;
        if (yield bcrypt_1.default.compare(newPassword, existingPass)) {
            matchedOne = lastPasswords[i];
            break;
        }
    }
    if (matchedOne === null || matchedOne === void 0 ? void 0 : matchedOne._id) {
        throw new appError_1.default("auth", {
            message: `Password change failed. Ensure the new password is unique and not among the last 2 used. (last used on ${(0, moment_1.default)(matchedOne === null || matchedOne === void 0 ? void 0 : matchedOne.updatedAt).format("YYYY-MM-DD [at] hh:mm A")}).`,
        });
    }
    const salt = yield bcrypt_1.default.genSalt();
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
    yield user_model_1.UserModel.updateOne({
        _id: _id,
    }, {
        $set: {
            password: hashedPassword,
        },
    });
    if ((yield password_model_1.passwordModel.countDocuments({ _id })) < 3) {
        password_model_1.passwordModel.create({
            userId: _id,
            value: hashedPassword,
        });
    }
    else {
        yield password_model_1.passwordModel.findOneAndDelete({ userId: _id }, { sort: { createdAt: 1 } });
        yield password_model_1.passwordModel.create({
            userId: _id,
            value: hashedPassword,
        });
    }
    const updateUser = yield user_model_1.UserModel.findOne({ _id });
    return updateUser;
});
exports.changePasswordService = changePasswordService;
// const getOneUserService = async (_id:string) => {
//   const updateUser = await UserModel.findOne({ _id }).select({
//   });
// }
