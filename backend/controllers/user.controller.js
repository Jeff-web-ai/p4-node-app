import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// middlewares
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";

// utils
import ErrorHandler from "../utils/ErrorHandler.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt.js";

// Model
import UserModel from "../models/user.model.js";

// Register new user
export const registerUser = catchAsyncError(async (req, res, next) => {
  try {
    const { username, email, password, role, licenseId, favoriteId } = req.body;

    console.log("Request Body:", req.body);

    // Ensure required fields are present
    if (!username || !email || !password || !role) {
      return next(
        new ErrorHandler(
          "Username, email, password, and role are required",
          400
        )
      );
    }

    if (role === "examinee") {
      if (!licenseId) {
        return next(
          new ErrorHandler("License ID is required for examinee role", 400)
        );
      }

      if (!mongoose.Types.ObjectId.isValid(licenseId)) {
        return next(new ErrorHandler("Invalid License ID", 400));
      }
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
      role,
      licenseId: role === "examinee" ? licenseId : null,
      favoriteId,
    });

    res.status(201).json({
      success: true,
      message: "New user registered successfully!",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login user
export const loginUser = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler(`No user with email of ${email}`));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    // Generate tokens
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Set cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 5 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Logout user
export const logoutUser = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    const userId = req.user._id;

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update access token
export const updateAccessToken = catchAsyncError(async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return next(new ErrorHandler("Refresh token not found", 400));
    }

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    if (!decoded) {
      return next(new ErrorHandler("Invalid refresh token", 400));
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "5m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "3d",
      }
    );

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get single user info
export const getUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req?.user?._id;

    const userInfo = await UserModel.findById(userId)
      .populate("favoriteId")
      .populate("licenseId");

    if (!userInfo) {
      return next(new ErrorHandler("No user found.", 404));
    }

    res.status(200).json({
      success: true,
      userInfo,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
