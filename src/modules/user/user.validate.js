import Joi from "joi";
import { generalValidation } from "./../../middleware/validation.js";

export const signupVal = Joi.object({
  firstName: generalValidation.firstName.required(),
  lastName: generalValidation.lastName.required(),
  email: generalValidation.email.required(),
  password: generalValidation.password.required(),
  recoveryEmail: generalValidation.recoveryEmail,
  DOB: generalValidation.DOB.required(),
  mobileNumber: generalValidation.mobileNumber.required(),
  role:generalValidation.role
}).required();

export const signInVal = Joi.object({
  email: generalValidation.email,
  mobileNumber: generalValidation.mobileNumber,
  password: generalValidation.password.required(),
}).required();

export const getSpecificUserVal = Joi.object({
  id: generalValidation.id.required(),
}).required();

export const updatePasswordVal = Joi.object({
  password: generalValidation.password.required(),
  id: generalValidation.id.required()
}).required();


export const updateUserVal = Joi.object({
  id: generalValidation.id.required(),
  firstName: generalValidation.firstName,
  lastName: generalValidation.lastName,
  email: generalValidation.email,
  recoveryEmail: generalValidation.recoveryEmail,
  DOB: generalValidation.DOB,
  mobileNumber: generalValidation.mobileNumber,
}).required();

export const recoveryEmailVal = Joi.object({
    recoveryEmail: generalValidation.recoveryEmail.required(),
}).required();

export const forgetPasswordVal = Joi.object({
    email: generalValidation.email.required(),
}).required();

export const verifyCodeVal = Joi.object({
    otp: generalValidation.otp.required(),
    token:generalValidation.token.required()
}).required();
