import { Job } from './../../database/models/job.model.js';


export const isJobOwner = async (req, res, next) => {
    const jobId = req.params.id;
    const user = req.user;

    const job = await Job.findById(jobId);
    if (job && job.addedBy.equals(user._id)) {
        next();
    } else {
        console.log(user._id);
        console.log(job);
        res.status(403).json({ message: 'Forbidden' });
    }
};