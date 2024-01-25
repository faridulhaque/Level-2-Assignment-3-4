import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errorType, errorSource } = err;

  // console.log(err)

  // error handling if an error return from mongoose pre method before saving anything in the collection
  if (errorType === "preCheck") {
    const { message, errorMessage, errorDetails, stack } =
      handlePreCheckError(errorSource);
    res.status(400).json({
      success: false,
      message,
      errorMessage,
      errorDetails,
      stack,
    });
  } else if (errorType === "JOI") {
    // if the error is related to JOI
    const { message, errorMessage, errorDetails, stack } =
      handleJoiError(errorSource);
    res.status(400).json({ message, errorMessage, errorDetails, stack });
  } else if (errorType === "auth") {
    if (errorSource?.message?.includes("Password change failed")) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errorSource?.message,
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: errorSource?.message,
        data: null,
      });
    }

    res.status(400).json({
      status: false,
      message: "Invalid Data",
      errorMessage: errorSource?.message,
      errorDetails: errorSource?.errorSource,
      stack: errorSource?.stack,
    });
  } else if (errorType === "Unauthorized Access") {
    res.status(400).json({
      success: false,
      message: errorType,
      errorMessage: errorSource?.message,
      errorDetails: null,
      stack: null,
    });
  } else {
    if (errorSource?.errorSource?.name === "CastError") {
      res.status(400).json({
        status: false,
        message: "Invalid Data",
        errorMessage: "Data is not valid",
        errorDetails: errorSource?.errorSource,
        stack: errorSource?.stack,
      });
    }
    res.status(200).json({ errorSource });
  }
};

const handlePreCheckError = (errorSource: any) => {
  return {
    message: errorSource?.message?.includes("already")
      ? "Duplicate Value"
      : "Invalid Data",
    errorMessage: errorSource?.message,
    errorDetails: "",
    stack: "",
  };
};

const handleJoiError = (errorSource: any) => {
  const allErrors = errorSource.details.map((detail: any) => detail.message);

  const issues = errorSource.details.map((detail: any) => ({
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
    stack: errorSource?.stack,
  };
};
