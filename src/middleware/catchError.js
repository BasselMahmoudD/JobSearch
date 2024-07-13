import { AppError } from "../utils/AppError.js";

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      }
      next();
    });
  };
};

export const globalError = (err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ error: "Error", message: err.message });
};
