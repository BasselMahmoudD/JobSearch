import { model, Schema } from 'mongoose';
import { jobLocation, seniorityLevel, workingTime } from "../../src/utils/common/enum.js";

const jobSchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    enum: Object.values(jobLocation),
    required: true,
  },
  workingTime: {
    type: String,
    enum: Object.values(workingTime),
    required: true,
  },
  seniorityLevel: {
    type: String,
    enum: Object.values(seniorityLevel),
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  technicalSkills: {
    type: [String],
    required: true,
  },
  softSkills: {
    type: [String],
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company:{
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  }
});

export const Job = model('Job', jobSchema);

