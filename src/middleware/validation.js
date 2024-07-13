import Joi from "joi";
import { jobLocation, role, seniorityLevel, status, workingTime } from "../utils/common/enum.js";
import { AppError } from "../utils/AppError.js";

export const generalValidation = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp(/^[A-Z][a-z0-9]{8,}$/)),
  recoveryEmail: Joi.string().email().optional(),
  DOB: Joi.date(),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/),
  role: Joi.string().valid(...Object.values(role)),
  status: Joi.string().valid(...Object.values(status)),
  otp: Joi.string().pattern(/^\d{6}$/),
  //Company validations
  companyName: Joi.string(),
  description: Joi.string(),
  industry: Joi.string(),
  address: Joi.string(),
  numberOfEmployees: Joi.number().min(11).max(20),
  companyEmail: Joi.string().email(),
  companyHR: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  //Job validations
  jobTitle: Joi.string(),
  jobLocation: Joi.string().valid(...Object.values(jobLocation)),
  workingTime: Joi.string().valid(...Object.values(workingTime)),
  seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)),
  jobDescription: Joi.string(),
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
  addedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  company:Joi.string(),
  //Application validations
  jobId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), 
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), 
  userTechSkills: Joi.array().items(Joi.string()),
  userSoftSkills: Joi.array().items(Joi.string()),
  userResume: Joi.string().uri(),
  // general
  id:Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  token:Joi.string().pattern(/^[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+$/)
};

export const validation = (schema) => {
  return (req, res, next) => {
    let { error } = schema.validate(
      { ...req.body, ...req.query, ...req.params },
      { abortEarly: false }
    );
    if (!error) {
      next();
    } else {
      let errorMsg = error.details.map(err => err.message);
     return next(new AppError(errorMsg, 400));
    }
  };
};
