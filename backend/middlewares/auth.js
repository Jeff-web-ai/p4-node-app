import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncErrors.js";
import UserModel from "../models/user.model.js";

//Authenticated Users
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  try {
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN || "");

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorHandler("Access token is not valid. Please try again.", 400)
    );
  }
});

// Validate user role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          404
        )
      );
    }
    next();
  };
};
