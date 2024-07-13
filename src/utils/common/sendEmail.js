import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { AppError } from "./../AppError.js";

export const sendEmail = async (email , message) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "baselmahmoudkamal@gmail.com",
      pass: "zhomwlnlssiryutk",
    },
  });

  jwt.sign({ email }, "JOB", { expiresIn: "5m" }, async (err, token) => {
    if (err) {
      next(new AppError(err, 401));
    } else {
      const info = await transporter.sendMail({
        from: '"Basel 👻" <baselmahmoudkamal@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        html: message, // html body
      });
      console.log("Message sent: %s", info.messageId);
    }
  });
};
