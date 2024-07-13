import Joi from "joi";
import { generalValidation } from "./../../middleware/validation.js";


export const addCompanyVal = Joi.object({
        companyName: generalValidation.companyName.required(),
        description: generalValidation.description.required(),
        industry: generalValidation.industry.required(),
        address: generalValidation.address.required(),
        numberOfEmployees: generalValidation.numberOfEmployees.required(),
        companyEmail: generalValidation.companyName.required(),
        companyHR:generalValidation.companyHR.required() ,
  }).required();

export const updateCompanyVal = Joi.object({
        companyName: generalValidation.companyName,
        description: generalValidation.description,
        industry: generalValidation.industry,
        address: generalValidation.address,
        numberOfEmployees: generalValidation.numberOfEmployees,
        companyEmail: generalValidation.companyName,
        companyHR:generalValidation.companyHR ,
        id:generalValidation.id.required()
  }).required();

export const deletedCompanyVal = Joi.object({
        id:generalValidation.id.required()
  }).required();
  
export const searchVal = Joi.object({
      name: generalValidation.companyName,
  }).required();
  