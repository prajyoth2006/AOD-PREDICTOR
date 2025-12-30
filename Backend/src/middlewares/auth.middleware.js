// auth middleware gives u access to the user in req so that it can be used for various purposes like loggout etc
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async(req,res,next) => {
  try {
    console.log("Incoming cookies:", req.cookies);
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
      throw new ApiError(402,"Unauthorized request");
    }
  
    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
  
    if(!user){
      throw new ApiError(401,"Invalid accessToken");
    }
    //here we created a new body called req.user so that we can access user using cookies or header which is mainly used in mobile application
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error has been occured while authenticating accessToken.Error : ${error}`);
    throw new ApiError(401,`Error has been occured while authenticating accessToken.Error : ${error}`);
  }
});

export {verifyJWT};