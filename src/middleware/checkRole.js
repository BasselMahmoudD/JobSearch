import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { status } from "../utils/common/enum.js";
import { messages } from "../utils/common/messages.js";
import jwt from "jsonwebtoken";



export const role = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return next(new AppError(messages.token.requiredToken, 400));
    }
    jwt.verify(token, "SIGN", async (err, decoded) => {
      if (err) {
        return next(new AppError(messages.token.invalidToken, 400));
      }
      const user = await User.findOne({ _id: decoded._id });
      if (!user) {
        return next(new AppError(messages.User.UserNotFound, 401));
      }
      if (user.status == status.Offline) {
        return next(new AppError(messages.User.mustLogin, 401));
      }if(user.role != "company_HR"){
        return next(new AppError(messages.User.yourRoleNotAuthorized, 402));
      }
      req.user = user;
      next();
    });
  };