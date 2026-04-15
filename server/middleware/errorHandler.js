import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof AppError
    ? err.statusCode
    : err.statusCode || err.status || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && err.stack && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};
