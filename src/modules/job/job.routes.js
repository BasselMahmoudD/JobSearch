import { Router } from "express";

import { asyncHandler } from "./../../middleware/catchError.js";
import {
  addJob,
  applyJob,
  deleteJob,
  filterJobs,
  getJobsWithCompany,
  searchJobBySpecificCompany,
  updateJob,
} from "./job.controller.js";
import { role } from "../../middleware/checkRole.js";
import { validation } from "../../middleware/validation.js";
import { addJopVal, deleteJopVal, updateJopVal } from "./job.validate.js";
import multer from "multer";
import uuidv4 from "uuidv4";
import { auth } from "../../middleware/auth.js";
import { fileUpload } from "../../fileUpload/fileUpload.js";

export const jobRouter = Router();


jobRouter
  .route("/")
  .post(role, validation(addJopVal), asyncHandler(addJob))
  .get(asyncHandler(getJobsWithCompany));
jobRouter
  .route("/:id")
  .put(role, validation(updateJopVal), asyncHandler(updateJob))
  .delete(role, validation(deleteJopVal), asyncHandler(deleteJob));
jobRouter.get(
  "/get-job-for-specific-company",
  asyncHandler(searchJobBySpecificCompany)
);
jobRouter.get("/filter", asyncHandler(filterJobs));
jobRouter.post(
  "/upload-application/:id",
  fileUpload("userResume"),
  auth,
  asyncHandler(applyJob)
);
