"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b;
    const { errorType, errorSource } = err;
    // console.log(err)
    // error handling if an error return from mongoose pre method before saving anything in the collection
    if (errorType === "preCheck") {
        const { message, errorMessage, errorDetails, stack } = handlePreCheckError(errorSource);
        res.status(400).json({
            success: false,
            message,
            errorMessage,
            errorDetails,
            stack,
        });
    }
    else if (errorType === "JOI") {
        // if the error is related to JOI
        const { message, errorMessage, errorDetails, stack } = handleJoiError(errorSource);
        res.status(400).json({ message, errorMessage, errorDetails, stack });
    }
    else if (errorType === "auth") {
        if ((_a = errorSource === null || errorSource === void 0 ? void 0 : errorSource.message) === null || _a === void 0 ? void 0 : _a.includes("Password change failed")) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: errorSource === null || errorSource === void 0 ? void 0 : errorSource.message,
                data: null,
            });
        }
        else {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: errorSource === null || errorSource === void 0 ? void 0 : errorSource.message,
                data: null,
            });
        }
        res.status(400).json({
            status: false,
            message: "Invalid Data",
            errorMessage: errorSource === null || errorSource === void 0 ? void 0 : errorSource.message,
            errorDetails: errorSource === null || errorSource === void 0 ? void 0 : errorSource.errorSource,
            stack: errorSource === null || errorSource === void 0 ? void 0 : errorSource.stack,
        });
    }
    else if (errorType === "Unauthorized Access") {
        res.status(400).json({
            success: false,
            message: errorType,
            errorMessage: errorSource === null || errorSource === void 0 ? void 0 : errorSource.message,
            errorDetails: null,
            stack: null,
        });
    }
    else {
        if (((_b = errorSource === null || errorSource === void 0 ? void 0 : errorSource.errorSource) === null || _b === void 0 ? void 0 : _b.name) === "CastError") {
            res.status(400).json({
                status: false,
                message: "Invalid Data",
                errorMessage: "Data is not valid",
                errorDetails: errorSource === null || errorSource === void 0 ? void 0 : errorSource.errorSource,
                stack: errorSource === null || errorSource === void 0 ? void 0 : errorSource.stack,
            });
        }
        res.status(200).json({ errorSource });
    }
};
exports.globalErrorHandler = globalErrorHandler;
const handlePreCheckError = (errorSource) => {
    var _a;
    return {
        message: ((_a = errorSource === null || errorSource === void 0 ? void 0 : errorSource.message) === null || _a === void 0 ? void 0 : _a.includes("already"))
            ? "Duplicate Value"
            : "Invalid Data",
        errorMessage: errorSource === null || errorSource === void 0 ? void 0 : errorSource.message,
        errorDetails: "",
        stack: "",
    };
};
const handleJoiError = (errorSource) => {
    const allErrors = errorSource.details.map((detail) => detail.message);
    const issues = errorSource.details.map((detail) => ({
        path: detail.path,
        expected: detail.type,
        received: detail.value,
    }));
    return {
        message: "Validation Error",
        errorMessage: allErrors,
        errorDetails: {
            name: "JoiError",
            issues: issues,
        },
        stack: errorSource === null || errorSource === void 0 ? void 0 : errorSource.stack,
    };
};
