import Joi from "joi"
import { generalValidation } from "../../middleware/validation.js"

export const addJopVal =Joi.object ({
    jobTitle:generalValidation.jobTitle.required() ,
jobLocation:generalValidation.jobLocation.required() ,
workingTime:generalValidation.workingTime.required() ,
seniorityLevel:generalValidation.seniorityLevel.required() ,
jobDescription:generalValidation.jobDescription.required() ,
technicalSkills:generalValidation.technicalSkills.required() ,
softSkills:generalValidation.softSkills.required(),
company:generalValidation.company.required()
}).required()

export const updateJopVal =Joi.object ({
    jobTitle:generalValidation.jobTitle ,
jobLocation:generalValidation.jobLocation ,
workingTime:generalValidation.workingTime ,
seniorityLevel:generalValidation.seniorityLevel ,
jobDescription:generalValidation.jobDescription ,
technicalSkills:generalValidation.technicalSkills ,
softSkills:generalValidation.softSkills,
company:generalValidation.company.required(),
id:generalValidation.id.required()
}).required()

export const deleteJopVal =Joi.object ({
id:generalValidation.id.required()
}).required()

export const search =Joi.object ({
name:generalValidation.companyName
}).required()