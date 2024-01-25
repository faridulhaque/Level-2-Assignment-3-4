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
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../errorHandlers/appError"));
const user_model_1 = require("../modules/user/user.model");
const verifyJwt = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtDecoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const { _id, role, email } = jwtDecoded;
    const user = yield user_model_1.UserModel.find({
        _id,
        role,
        email,
    });
    if (!user) {
        throw new appError_1.default("Unauthorized Access", {
            message: "You do not have the necessary permissions to access this resource.",
        });
    }
    console.log(_id, role, email);
    return {
        _id,
        role,
        email,
    };
});
exports.verifyJwt = verifyJwt;
