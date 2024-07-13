import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { User } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { messages } from "../../utils/common/messages.js";
import { Application } from "./../../../database/models/application.model.js";

const addJob = async (req, res, next) => {
  // check company exist
  let company = await Company.findOne({ _id: req.body.company });
  if (!company)
    return next(new AppError(messages.Company.companyNotFound, 404));
  // add job
  let job = new Job(req.body);
  job.addedBy = req.user._id;
  await job.save();
  // send res
  return res.status(201).json({
    message: messages.Job.createdJob,
    Data: job,
  });
};
///////////////////////////////////////////////////////////
const updateJob = async (req, res, next) => {
  // check company exist
  let company = await Company.findOne({ companyName: req.body.company });
  if (!company)
    return next(new AppError(messages.Company.companyNotFound, 404));
  // update job
  let job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!job) return next(new AppError(messages.Job.jobNotFound, 404));
  //   send res
  return res.status(202).json({
    message: messages.Job.updatedJob,
    Data: job,
  });
};
///////////////////////////////////////////////////////////
const deleteJob = async (req, res, next) => {
  // find job and delete
  let job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return next(new AppError(messages.Job.jobNotFound, 404));
  //   send res
  return res.status(202).json({
    message: messages.Job.deletedJob,
    Data: job,
  });
};
///////////////////////////////////////////////////////////
const getJobsWithCompany = async (req, res, next) => {
  let job = await Job.find().populate("company");
  return res.status(200).json({
    message: messages.Job.allJobs,
    Data: job,
  });
};
//////////////////////////////////////////////////////////
const searchJobBySpecificCompany = async (req, res, next) => {
  let { name } = req.query;
  const company = await Company.findOne({ companyName: name });
  if (!company)
    return next(new AppError(messages.Company.companyNotFound, 404));
  let companyId = company._id;
  console.log(companyId);
  let jobs = await Job.find({ company: companyId });
  res.json({
    success: true,
    Data: jobs,
  });
};
//////////////////////////////////////////////////////////
const filterJobs = async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;

  let filter = {};

  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills)
    filter.technicalSkills = { $all: technicalSkills.split(",") };

  let jobs = await Job.find(filter);

  return res.status(200).json({
    message: messages.Job.allJobs,
    Data: jobs,
  });
};
//////////////////////////////////////////////////////////
const applyJob = async (req, res, next) => {
  try {
    const jobID = req.params.id;
    if (!jobID) return next(new AppError(messages.Job.jobNotFound, 404));

    req.body.jobId = jobID;
    req.body.userId = req.user._id;
    req.body.userResume = req.file.filename;

    let application = new Application({
      jobId: req.body.jobId,
      userId: req.body.userId,
      userTechSkills: req.body.userTechSkills,
      userSoftSkills: req.body.userSoftSkills,
      userResume: "http://localhost:3000/jobs/uploads/" + req.body.userResume,
    });

    await application.save();

    return res.status(201).json({
      message: messages.Application.YourAppliedSuccessfully,
      Data: application,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
export {
  addJob,
  updateJob,
  deleteJob,
  getJobsWithCompany,
  searchJobBySpecificCompany,
  filterJobs,
  applyJob,
};
