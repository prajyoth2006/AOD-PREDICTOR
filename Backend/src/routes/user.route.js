import { Router } from "express";
import { forgetPasswordRequest, forgetPasswordVerify, getUserDetails, loginUser, logOutUser, registerUser, resetPassword, updateCurrentPassword, updateDetails } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

console.log("Request received on user.route.js");

//register
router.route("/register").post(registerUser);

//login
router.route("/login").post(loginUser);

//forgetPassword 
router.route("/forget-pass-req").post(forgetPasswordRequest); //sending otp
router.route("/forget-pass-verify").post(forgetPasswordVerify); //verifying otp
router.route("/reset-password").post(resetPassword); //reset password after verifying

//logout - secured routes
router.route("/logout").post(verifyJWT,logOutUser); //logout user
router.route("/update-password").post(verifyJWT,updateCurrentPassword); //update current password
router.route("/user-details").get(verifyJWT,getUserDetails); //fetch user details
router.route("/update-details").post(verifyJWT,updateDetails) //update details like name and phone

export default router;