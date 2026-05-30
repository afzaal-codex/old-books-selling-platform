export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode || 500;

  let message = err.message || "Internal Server Error";

  // MongoDB Cast Error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // JWT Expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please login again";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : null,
  });
};