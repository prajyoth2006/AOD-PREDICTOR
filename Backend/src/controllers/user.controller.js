import {ApiError} from "../utils/ApiError.js";
import {ApiResponce} from "../utils/ApiResponce.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {otpSender,otpVerifier} from "../utils/OtpGenerator.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async function(userId) {
  try {
    const user = await User.findById(userId);
    
    if(!user){
      console.log("User not found while generating tokens");
      throw new ApiError(401,"User not found while generating tokens");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
  
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})
  
    return {accessToken,refreshToken};
  } catch (error) {
    console.log(`Failed to generate access token . The following error has been occured : ${error}`);
    throw new ApiError(501,`Failed to generate access token . The following error has been occured : ${error}`);
  }
}

const registerUser = asyncHandler(async(req,res) => {
  console.log("Request received for registerUser");

  const {email,password,fullName,phone} = req.body;

  if(
    [fullName,email,phone,password].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400,"all field are necessary");
  }

  const existedUser = await User.findOne(
    {
      email
    }
  );

  if(existedUser){
    throw new ApiError(401,"User already exist");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    phone
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering");
  }

  console.log("User created:", user._id);

  return res.status(200).json(
    new ApiResponce(200,"User created successfully",createdUser)
  )
});

const loginUser = asyncHandler(async(req,res) => {
  //req.body
  //empty
  //user exist or not
  //password verify
  //gen accesstoken and refreshtoken
  //update the user 
  //send the responce through cookies

  console.log("Request received for loginUser");
  const {email,password } = req.body;

  if(!email || !password){
    throw new ApiError(400,"Email and password are required");
  }

  const user = await User.findOne({email});

  if(!user){
    throw new ApiError(404,"User doesn't exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401,"Invalid login credentials")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedUser = await User.findById(user._id).select("-password -refreshToken");

  const options =  {
    httpOnly: true,
    secure: false,         // ❗ MUST be false on localhost (no HTTPS)
    sameSite: "Lax",       // "lax" is good for local dev
    maxAge: 15 * 60 * 1000,
    path : "/" // 15 minutes
  }

  console.log(`User successfully logged in with user id : ${loggedUser._id} and email : ${loggedUser.email}`);
  res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    new ApiResponce(201,"SUCCESSFULLY LOGGED IN",{user : loggedUser,accessToken,refreshToken})
  );
});

const logOutUser = asyncHandler(async(req,res) => {
  //first access user
  //clear cookies
  //reset refresh token in db for the user
  //send the responce

  console.log("request received on logout user");
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        refreshToken : undefined
      }
    },
    {
      new : true
    }
  );

  const options =  {
    httpOnly: true,
    secure: false,         // ❗ MUST be false on localhost (no HTTPS)
    sameSite: "Lax",       // "lax" is good for local dev
    maxAge: 15 * 60 * 1000,
    path : "/" // 15 minutes
  }

  console.log("USER LOGGED OUT SUCCESSFULLY !!");
  console.log(`${req.user.email}`);
  res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponce(200,"USER LOGGED OUT SUCCESSFULLY",{user : req.user.email})
  );
});

const refreshAccessToken = asyncHandler(async(req,res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if(!incomingRefreshToken){
    throw new ApiError(404,"Refresh token missing");
  }

  try{
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    
    if(!user){
      throw new ApiError(404,"Invalid refresh token");
    }
  
    if(user?.refreshToken !== incomingRefreshToken){
      throw new ApiError(404,"refreshToken expired or used");
    }
  
    const {accessToken,refreshToken : newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    const options = {
      httpOnly : true,
      secure : false,
      maxAge: 15 * 60 * 1000
    }
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponce(
        200,
        "access token refreshed",
        {
          accessToken,refreshToken : newRefreshToken
        }
      )
    );
  } catch (error) {
    console.log(`ACCESSTOKEN GENERATION ERROR WITH REFRESHTOKEN . ERROR : ${error}`);
    throw new ApiError(404,`ACCESSTOKEN GENERATION ERROR WITH REFRESHTOKEN . ERROR : ${error}`)
  }
});

const updateCurrentPassword = asyncHandler(async(req,res) => {
  console.log("request received on update password");
  const {oldPassword,newPassword} = req.body;
  if(!oldPassword || !newPassword){
    throw new ApiError(400,"newpassword and oldpassword both are necessary");
  }

  const user = await User.findById(req.user._id);
  if(!user){
    throw new ApiError(404,"User not found or unauthorized request");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if(!isPasswordValid){
    throw new ApiError(401,"Invalid credentials or password");
  }

  user.password = newPassword;
  await user.save();

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  console.log(`password updated successfully for the user . user email : ${updatedUser.email}`);
  return res
  .status(200)
  .json(
    new ApiResponce(
      200,
      "Password changed successfully",
      {updatedUser}
    )
  );
});

const getUserDetails = asyncHandler(async(req,res) => {
  console.log("request received on getUserDetails");
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if(!user){
    throw new ApiError(404,"user not found");
  }

  try {
    console.log("User details fetched successfully");
    return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        "User details fetched successfully",
        {user}
      )
    );
  } catch (error) {
    console.log(`Error occured while fetching user details. Error : ${error}`);
    throw new ApiError(
      501,
      "Unable to fetch details"
    );
  }
});

const updateDetails = asyncHandler(async (req, res) => {
  console.log("request received on updateDetails");

  const { newFullName, newPhone } = req.body;

  if (newFullName === undefined && newPhone === undefined) {
    throw new ApiError(400, "At least one of newFullName or newPhone must be provided");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (typeof newFullName === "string" && newFullName.trim() !== "") {
    user.fullName = newFullName.trim();
  }

  if (typeof newPhone === "string" && newPhone.trim() !== "") {
    user.phone = newPhone.trim();
  }

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  console.log("successfully changed all fields which are requested");

  return res.status(200).json(
    new ApiResponce(200, "User details updated successfully", { updatedUser })
  );
});

const forgetPasswordRequest = asyncHandler(async(req,res) => {
  console.log(`request received on forgetPasswordRequest`);
  const {email} = req.body;
  if(!email){
    throw new ApiError(401,"Email is required");
  }

  try {
    await otpSender(email);
    console.log("Otp sent successfully");

    const verifyToken = jwt.sign(
      {email},
      process.env.VERIFY_PASSWORD_SECRET,
      {expiresIn : process.env.VERIFY_PASSWORD_EXPIRY}
    );

    const options =  {
      httpOnly: true,
      secure: false,         // ❗ MUST be false on localhost (no HTTPS)
      sameSite: "Lax",       // "lax" is good for local dev
      maxAge: 15 * 60 * 1000,
      path : "/" // 15 minutes
    }

    return res
    .status(200)
    .cookie("verifyToken",verifyToken,options)
    .json(
      new ApiResponce(
        200,
        "Otp successfully sent"
      )
    );
  } catch (error) {
    console.error("OTP sending failed:", error);
    throw new ApiError(error.statusCode || 500 ,error.message);
  }
});

const forgetPasswordVerify = asyncHandler(async (req, res) => {
  console.log("Request received on verify otp");
  const receivedToken = req.cookies?.verifyToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!receivedToken) {
    throw new ApiError(401, "Token is missing");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(receivedToken, process.env.VERIFY_PASSWORD_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const userEmail = decodedToken.email;
  if (!userEmail) {
    throw new ApiError(401, "No email in token");
  }

  const { otpEntered } = req.body;

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  };

  const resetToken = jwt.sign(
    { userEmail },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: process.env.RESET_PASSWORD_EXPIRY }
  );

  try {
    const result = await otpVerifier(userEmail, otpEntered); 
    console.log(result);
    console.log("Otp verified successful");

    if (result.success) {
      return res
        .status(200)
        .clearCookie("verifyToken", options)
        .cookie("resetToken", resetToken, options)
        .json(new ApiResponce(200, "Otp verified successful"));
    } else {
      throw new ApiError(400, "Invalid or expired OTP");
    }
  } catch (err) {
    console.error("OTP verification failed:", err);
    throw new ApiError(err.statusCode || 500, err.message);
  }
});

const resetPassword = asyncHandler(async(req,res) => {
  console.log("Reset Password request");
  const receivedToken = req.cookies?.resetToken || req.header("Authorization")?.replace("Bearer ","");
  if(!receivedToken){
    throw new ApiError(401, "Token is missing");
  }

  let decodedToken ;
  try {
    decodedToken = jwt.verify(receivedToken,process.env.RESET_PASSWORD_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const userEmail = decodedToken.userEmail;
  if (!userEmail) {
    throw new ApiError(401, "No email in token");
  }

  const {newPassword} = req.body;
  if(!newPassword){
    throw new ApiError(401,"password is required");
  }

  const user = await User.findOne({email : userEmail});
  if(!user){
    throw new ApiError(401, "No user is found");
  }

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  };

  user.password = newPassword;
  try {
    await user.save();
    return res.status(200).clearCookie("resetToken",options).json(
      new ApiResponce(
        200,
        "password reset successfully"
      )
    );
  } catch (error) {
    console.log("error occured while reseting password",error.message);
    throw new ApiError(501,"Sever error occured");
  }
}); 

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  updateCurrentPassword,
  getUserDetails,
  updateDetails,
  forgetPasswordRequest,
  forgetPasswordVerify,
  resetPassword
};