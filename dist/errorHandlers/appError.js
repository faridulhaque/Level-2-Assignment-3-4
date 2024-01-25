"use strict";
// extended class named appError from default error
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(errorType, errorSource, stack = "") {
        super(errorType);
        this.errorType = errorType;
        this.errorSource = errorSource;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
