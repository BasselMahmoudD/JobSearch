import express from "express";
import multer from "multer";
import { db } from "./database/dbConnection.js";
import { asyncHandler, globalError } from "./src/middleware/catchError.js";
import { userRouter } from "./src/modules/user/user.routes.js";
import { companyRouter } from "./src/modules/company/company.routes.js";
import { jobRouter } from "./src/modules/job/job.routes.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use("/uploads" , express.static('uploads'))
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/jobs", jobRouter);

app.use(globalError);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
