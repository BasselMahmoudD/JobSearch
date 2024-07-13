import bcrypt from "bcrypt";
import { User } from "./../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { messages } from "../../utils/common/messages.js";
import { sendEmail } from "./../../utils/common/sendEmail.js";
import jwt from "jsonwebtoken";
import { status } from "../../utils/common/enum.js";

const signup = async (req, res, next) => {
  // get data from req
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    isVerified,
    role
  } = req.body;
  // check exist
  let existUser = await User.findOne({ email, mobileNumber });
  if (existUser && isVerified == true && mobileNumber) {
    return next(new AppError(messages.User.ExistUser, 404));
  }
  if (existUser && isVerified == false) {
    sendEmail(
      email,
      "<b>To verify Your Email click <a href='http://localhost:3000/user/verify-email/${token}'>here</a></b>"
    );
  }
  // hash password
  let hashedPassword = bcrypt.hashSync(password, 8);
  // prepare user
  let userName = firstName + " " + lastName;
  const user = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
    recoveryEmail,
    DOB,
    mobileNumber,
    isVerified,
    role
  });
  // save user
  let createdUser = await user.save();

  // send Email
  sendEmail(email);
  // send res
  return res.status(201).json({
    message: messages.User.USerCreatedSuccessfully,
    Data: createdUser,
  });
};
///////////////////////////////////////////////////////////////
const verifyEmail = async (req, res, next) => {
  // get data from req
  const { token } = req.params;
  // check token
  jwt.verify(token, "JOB", async (err, payload) => {
    if (err && !payload?.email) {
      return next(new AppError(messages.token.invalidToken, 400));
    }
    // verify Account
    let user = await User.findOneAndUpdate(
      { email: payload.email, isVerified: false },
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return next(new AppError(messages.User.UserNotFound, 404));
    }
  });
  //   send response
  return res.status(200).json({ message: messages.User.verifyAccount });
};
///////////////////////////////////////////////////////////////
const signIn = async (req, res, next) => {
  // get data from req
  const { email, password, mobileNumber } = req.body;
  // check exist
  let existUser = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  if (!existUser) {
    return next(new AppError(messages.User.UserNotFound, 404));
  }
  // check password
  if (!bcrypt.compareSync(password, existUser.password)) {
    return next(new AppError(messages.User.invalidCredentials, 404));
  }
  // check verified
  if (!existUser.isVerified) {
    jwt.sign({ email }, "JOB", { expiresIn: "5m" }, async (err, token) => { 
      sendEmail(
        email,
        `<b>To verify Your Email click <a href='http://localhost:3000/user/verify-email/${token}'>here</a></b>`
      );

      return next(new AppError(messages.User.verifyAccountFirst, 404));
    });
  }
  //  update status
  existUser.status = status.Online;
  await existUser.save();
  // generate token
  jwt.sign({ _id: existUser._id }, "SIGN", (err, token) => {
    if (err) {
      return next(new AppError(messages.token.invalidToken, 401));
    }
    // send response
    return res
      .status(201)
      .json({ message: messages.User.SignInSuccessfully, token: token });
  });
};
////////////////////////////////////////////////////////////////
const getMyProfile = (req, res, next) => {
  return res
    .status(200)
    .json({ message: messages.User.myProfile, Data: req.user });
};
///////////////////////////////////////////////////////////////
const getUserById = async (req, res, next) => {
  // get Id
  let id = req.params.id;
  // find User
  let user = await User.findOne({ _id: id });
  // Hide password
  user.password = undefined;
  if (!user) {
    return next(new AppError(messages.User.UserNotFound, 404));
  }
  // send res
  return res
    .status(200)
    .json({ message: messages.User.specificUser, Data: user });
};
///////////////////////////////////////////////////////////////
const updatePassword = async (req, res, next) => {
  // get pass from req
  const { password } = req.body;
  // hash pass
  let hashedPassword = bcrypt.hashSync(password, 8);
  // update User
  let user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { password: hashedPassword },
    { new: true }
  );
  if (!user) {
    return next(new AppError(messages.User.UserNotFound, 404));
  }
  // send res
  return res.status(200).json({ message: messages.User.updated, Data: user });
};
///////////////////////////////////////////////////////////////
const getAccRelatedRecoveryEmail = async (req, res, next) => {
  // get Data from req
  const { recoveryEmail } = req.body;
  // find Users
  let users = await User.find({ recoveryEmail });
  if (!users) {
    return next(new AppError(messages.User.UserNotFound, 404));
  }
  // send res
  return res.status(200).json({ message: messages.User.allUser, Data: users });
};
///////////////////////////////////////////////////////////////
const updateUser = async (req, res, next) => {
  // check owner
  let id = req.params.id;
  if (req.user._id != id) {
    return next(new AppError(messages.User.inVAlidID, 401));
  }
  // check new email and pass
  const { email, mobileNumber, lastName, firstName } = req.body;
  let existData = await User.findOne({
    $or: [{ email }, { mobileNumber }],
    _id: { $ne: id },
  });
  if (existData) {
    return next(new AppError(messages.User.inValidData, 402));
  }
  // update user
  if (firstName || lastName) {
    const newFirstName = firstName || req.user.firstName;
    const newLastName = lastName || req.user.lastName;
    req.body.userName = `${newFirstName} ${newLastName}`;
  }
  let user = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  // check exist user
  if (!user) {
    return next(new AppError(messages.User.UserNotFound, 402));
  }
  // send res
  return res
    .status(202)
    .json({ message: messages.User.updatedUser, Data: user });
};
///////////////////////////////////////////////////////////////
const deleteUser = async (req, res, next) => {
  // check owner
  let id = req.params.id;
  if (req.user._id != id) {
    return next(new AppError(messages.User.inVAlidID, 401));
  }
  let user = await User.findByIdAndDelete({ _id: req.user._id });
  // check exist user
  if (!user) {
    return next(new AppError(messages.User.UserNotFound, 402));
  }
  // send res
  return res
    .status(202)
    .json({ message: messages.User.deletedUser, Data: user });
};
///////////////////////////////////////////////////////////////
const forgetPassword = async (req, res, next) => {
  // get data from req
  const { email } = req.body;
  // generate otp code

  let otpCode = Math.floor(Math.random() * 1000000);

  // find user
  let user = await User.findOne({ email });

  let newOtp = bcrypt.hashSync(otpCode.toString(), 8);
  user.otp = newOtp;
  user.expiredCode = generateExpirationDate();
  await user.save();
  // check user exist
  if (!user) return next(new AppError(messages.User.UserNotFound, 404));
  // send email
  sendEmail(email, `<b>The OTP code is : ${otpCode} </b>`);
  // generate token
  jwt.sign({ email }, "otp", (err, token) => {
    if (err) return next(new AppError(messages.token.invalidToken));
    // send Res
    return res.status(200).json({
      success: true,
      message: messages.User.checkYourEmail,
      RedirectURL: `http://localhost:3000/user/forget-password/verify-code/${token}`,
    });
  });
};
// function to get ExpiredDate for Code
function generateExpirationDate() {
  const now = new Date();
  return new Date(now.getTime() + 15 * 60000); // 15 minutes in milliseconds
}
//////////////////////////////////////////////////////////////
const verifyOTP = async (req, res, next) => {
  // get data from req
  let otpCode = req.body.otp;
  let token = req.params.token;
  // verify Token
  jwt.verify(token, "otp", async (err, decoded) => {
    if (!decoded.email) return next(new AppError(messages.token.invalidToken));
    let email = decoded.email;
    let user = await User.findOne({ email });
    // compare otp code
    if (
      !bcrypt.compareSync(otpCode, user.otp) ||
      Date.now() > user.expiredCode
    ) {
      return next(new AppError(messages.User.invalidCode));
    }
    // send res
    return res.status(200).json({
      success: true,
      message: messages.User.Done,
      RedirectURL: `http://localhost:3000/user/forget-password/update-forget-password/${user._id}`,
    });
  });
};
////////////////////////////////////////////////////////////////
const updateForgetPassword = async (req, res, next) => {
  // get pass from req
  const { password } = req.body;
  // hash pass
  let hashedPassword = bcrypt.hashSync(password, 8);
  // update User
  let user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { password: hashedPassword },
    { new: true }
  );
  if (!user) {
    return next(new AppError(messages.User.UserNotFound, 404));
  }
  // send res
  return res.status(200).json({ message: messages.User.updatedUser });
};

export {
  signup,
  verifyEmail,
  signIn,
  getMyProfile,
  getUserById,
  updatePassword,
  getAccRelatedRecoveryEmail,
  updateUser,
  deleteUser,
  forgetPassword,
  verifyOTP,
  updateForgetPassword,
};
