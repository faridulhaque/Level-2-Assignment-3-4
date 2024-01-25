// extended class named appError from default error

class AppError extends Error {
  public errorType: string;
  public errorSource: any;

  constructor(errorType: string, errorSource: any, stack = "") {
    super(errorType);
    this.errorType = errorType;
    this.errorSource = errorSource;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
