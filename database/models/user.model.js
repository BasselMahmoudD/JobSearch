import { Schema, model } from "mongoose";
import { role, status } from "../../src/utils/common/enum.js";



const schema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    recoveryEmail: String,
    DOB: {
      type: Date,
    },
    mobileNumber: String,
    role: {
      type: String,
      enum: Object.values(role),
      default: role.User,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.Offline,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp:String,
    expiredCode: {
      type: Date,
    },
  },
  {
    timestamps: {
      updatedAt: false,
    },
    versionKey: false,
  }
);

export const User = model("User", schema);
