import mongoose from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { messages } from "../../utils/common/messages.js";
import { Company } from "./../../../database/models/company.model.js";
import { User } from "./../../../database/models/user.model.js";
import { role } from "../../utils/common/enum.js";
import { Job } from "../../../database/models/job.model.js";
import { Application } from './../../../database/models/application.model.js';

const addCompany = async (req, res, next) => {
  try {
    // Get data from req
    const { companyName, companyEmail, companyHR } = req.body;

    // Check if companyHR is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(companyHR)) {
      return next(new AppError(messages.User.invalidUserID, 400));
    }

    // Check if the company already exists
    let exist = await Company.findOne({
      $or: [{ companyEmail }, { companyName }],
    });
    if (exist) {
      return next(new AppError(messages.Company.companyIsExist, 400));
    }

    // Check role of companyHR
    let userRole = await User.findById(companyHR);
    if (!userRole) {
      return next(new AppError(messages.User.UserNotFound, 404));
    }
    if (userRole.role != role.Company_HR) {
      return next(new AppError(messages.Company.userIDNotAuthorized, 400));
    }

    // Insert data to DB
    let company = new Company(req.body);
    await company.save();

    return res.status(201).json({
      message: messages.Company.createdCompany,
      success: true,
      Data: company,
    });
  } catch (error) {
    return next(error);
  }
};
/////////////////////////////////////////////////////////////////////////
const updateCompany = async (req, res, next) => {
  try {
    // Get data from req
    const {
      companyName,
      companyEmail,
      description,
      companyHR,
      numberOfEmployees,
      address,
      industry,
    } = req.body;

    // Get company ID from params
    let id = req.params.id;

    // Find company by ID
    let company = await Company.findById(id);

    // Check if company exists
    if (!company) {
      return next(new AppError(messages.Company.companyNotFound, 404));
    }

    // Check if the requesting user is authorized
    if (req.user._id.toString() !== company.companyHR.toString()) {
      return next(new AppError(messages.User.yourRoleNotAuthorized, 403));
    }

    // Check role of companyHR
    let userRole = await User.findById(companyHR);
    if (!userRole) {
      return next(new AppError(messages.User.UserNotFound, 404));
    }
    if (userRole.role != role.Company_HR) {
      return next(new AppError(messages.Company.userIDNotAuthorized, 400));
    }

    // Check if new email or company name already exists in another company
    let exist = await Company.findOne({
      $or: [{ companyEmail }, { companyName }],
      _id: { $ne: id },
    });

    if (exist) {
      return next(new AppError(messages.Company.companyIsExist, 402));
    }

    // Update company
    company.companyName = companyName || company.companyName;
    company.companyEmail = companyEmail || company.companyEmail;
    company.description = description || company.description;
    company.companyHR = companyHR || company.companyHR;
    company.numberOfEmployees = numberOfEmployees || company.numberOfEmployees;
    company.address = address || company.address;
    company.industry = industry || company.industry;

    let updatedCompany = await company.save();

    // Send response
    return res.status(200).json({
      message: messages.Company.updatedCompany,
      success: true,
      Data: updatedCompany,
    });
  } catch (error) {
    return next(error);
  }
};
/////////////////////////////////////////////////////////////////////////
const deleteCompany = async (req, res, next) => {
  // Get company ID from params
  let id = req.params.id;

  // Find company by ID
  let company = await Company.findById(id);

  // Check if company exists
  if (!company) {
    return next(new AppError(messages.Company.companyNotFound, 404));
  }

  // Check if the requesting user is authorized
  if (req.user._id.toString() !== company.companyHR.toString()) {
    return next(new AppError(messages.User.yourRoleNotAuthorized, 403));
  }

  // Update company
  let deletedCompany = await Company.findByIdAndDelete(id);

  // Send response
  return res.status(200).json({
    message: messages.Company.deletedCompany,
    success: true,
    Data: deletedCompany,
  });
};
/////////////////////////////////////////////////////////////////////////
const getSpecificCompany = async (req, res, next) => {
  // get id for company
  let id = req.params.id;
  // search for company
  let company = await Company.findById(id);
  // Check if company exists
  if (!company) {
    return next(new AppError(messages.Company.companyNotFound, 404));
  }
  let relatedJobs = await Job.find({ company: id });
  return res.status(200).json({
    success: true,
    Data: company,
    relatedJobs,
  });
};
/////////////////////////////////////////////////////////////////////////
const searchCompany = async (req, res) => {
  let { name } = req.query;
  const companies = await Company.find({ companyName: name });
  res.json({
    success: true,
    Data: companies,
  });
};
/////////////////////////////////////////////////////////////////////////
const getAllApplications = async (req, res) => {
  const jobId = req.params.id;

  const applications = await Application.find({ jobId })
  console.log(applications);
  if(!applications)  return next(new AppError(messages.Application.ApplicationNoFound , 404))
  res.status(200).json({message:"Success" , Applications:applications});

};
export {
  addCompany,
  updateCompany,
  deleteCompany,
  getSpecificCompany,
  searchCompany,
  getAllApplications
};
