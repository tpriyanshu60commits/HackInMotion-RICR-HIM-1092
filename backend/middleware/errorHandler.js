export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Standardized MNC-level error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || statusCode.toString(),
      message,
    },
    // Keep stack trace in dev
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
