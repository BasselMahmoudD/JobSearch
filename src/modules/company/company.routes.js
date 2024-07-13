import { Router } from "express";
import { addCompany,deleteCompany, getAllApplications, getSpecificCompany, searchCompany, updateCompany } from "./company.controller.js";
import { asyncHandler } from "../../middleware/catchError.js";
import { role } from "../../middleware/checkRole.js";
import { validation } from "../../middleware/validation.js";
import { addCompanyVal, deletedCompanyVal, searchVal, updateCompanyVal } from "./company.validate.js";
import { isJobOwner } from "../../middleware/jobOwner.js";


export const companyRouter = Router()


companyRouter.post('/add-company' ,role , validation(addCompanyVal) ,asyncHandler(addCompany) )
companyRouter.put('/update-company/:id' ,role , validation(updateCompanyVal) ,asyncHandler(updateCompany) )
companyRouter.delete('/delete-company/:id' , role , validation(deletedCompanyVal),asyncHandler(deleteCompany))  
companyRouter.get('/get-specific-company/:id' , role , validation(deletedCompanyVal),asyncHandler(getSpecificCompany))
companyRouter.get('/search' , role , validation(searchVal),asyncHandler(searchCompany))
companyRouter.get('/applications/:id' ,role,isJobOwner , asyncHandler(getAllApplications))