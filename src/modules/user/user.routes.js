import { Router } from "express";
import {
  signup,
  verifyEmail,
  signIn,
  getMyProfile,
  getUserById,
  updatePassword,
  getAccRelatedRecoveryEmail,
  updateUser,
  deleteUser,
  forgetPassword,
  verifyOTP,
  updateForgetPassword,
} from "./user.controller.js";
import { asyncHandler } from "../../middleware/catchError.js";
import { validation } from "../../middleware/validation.js";
import {
  forgetPasswordVal,
  getSpecificUserVal,
  recoveryEmailVal,
  signInVal,
  signupVal,
  updatePasswordVal,
  updateUserVal,
  verifyCodeVal,
} from "./user.validate.js";
import { auth } from "../../middleware/auth.js";

export const userRouter = Router();

userRouter.post("/signup", validation(signupVal), asyncHandler(signup));
userRouter.get("/verify-email/:token", asyncHandler(verifyEmail));
userRouter.post("/sign-in", validation(signInVal), asyncHandler(signIn));
userRouter.get("/get-my-profile", auth, asyncHandler(getMyProfile));
userRouter.get(
  "/get-specific-user/:id",
  validation(getSpecificUserVal),
  asyncHandler(getUserById)
);
userRouter.put(
  "/update-password/:id",
  validation(updatePasswordVal),
  asyncHandler(updatePassword)
);
userRouter.get(
  "/recovery-email",
  validation(recoveryEmailVal),
  asyncHandler(getAccRelatedRecoveryEmail)
);
userRouter.put(
  "/update-user/:id",
  auth,
  validation(updateUserVal),
  asyncHandler(updateUser)
);
userRouter.delete(
  "/delete-user/:id",
  auth,
  validation(getSpecificUserVal),
  asyncHandler(deleteUser)
);
userRouter.post(
  "/forget-password",
  validation(forgetPasswordVal),
  asyncHandler(forgetPassword)
);
userRouter.post(
  "/forget-password/verify-code/:token",
  validation(verifyCodeVal),
  asyncHandler(verifyOTP)
);
userRouter.put(
  "/forget-password/update-forget-password/:id",
  validation(updatePasswordVal),
  asyncHandler(updateForgetPassword)
);
