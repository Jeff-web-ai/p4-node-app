import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
} from "../controllers/user.controller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh-token", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

export default userRouter;
