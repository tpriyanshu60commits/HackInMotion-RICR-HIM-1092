class AppError extends Error {
  constructor(code, message, statusCode) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
