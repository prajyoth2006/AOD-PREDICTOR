import nodemailer from "nodemailer";
import {ApiResponce} from "./ApiResponce.js";
import {ApiError} from "./ApiError.js";
//import {validateEmailAddress} from "./EmailVerifier.js";

//creating transport
const Transport = nodemailer.createTransport({
  service : "gmail",
  auth : {
    user : process.env.GMAIL,
    pass : process.env.PASSWORD
  }
});

const otpStore = {};

//generation of otp
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//Sending of Otp
async function otpSender(email){
  //await validateEmailAddress(email);

  let otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    await Transport.sendMail({
      from : process.env.GMAIL,
      to : email,
      subject : "AOD FINDER Verification",
      text : `Your OTP for the Forgot-Password is ${otp}`
    });

    return new ApiResponce(200,"OTP SENT SUCCESSFULLY");
  }catch(error){
    console.log(`While generating otp following error has been occured : ${error.message}`);
    throw new ApiError(404,`Failed to send otp . Following error has been occured ${error}`);
  }
}

//Verification of Otp
async function otpVerifier(email, otpEntered) {
  const record = otpStore[email];

  if(!record){
    throw new ApiError(404, "No OTP found for this email");
  }

  if(Date.now()>record.expiresAt){
    delete otpStore[email];
    throw new ApiError(410, "OTP has expired");
  }

  if(record.otp === otpEntered){
    delete otpStore[email];
    return new ApiResponce(200, "OTP successfully verified");
  }else{
    throw new ApiError(400, "Invalid OTP");
  }
}

//cleaning expired otps
function cleanupExpiredOtps() {
  const now = Date.now();
  for (const email in otpStore) {
    if (otpStore[email].expiresAt < now) {
      delete otpStore[email];
    }
  }
  console.log("all otps deleted");
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredOtps, 10 * 60 * 1000);

export {otpSender,otpVerifier};