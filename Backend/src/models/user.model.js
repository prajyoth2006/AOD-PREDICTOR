import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName : {
      type : String,
      required : true,
      trim : true
    },
    email : {
      type : String,
      required : true,
      trim : true,
      unique : true,
      lowercase : true
    },
    password : {
      type : String,
      required : true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps : true
  }
);

userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();
  
  this.password = await bcrypt.hash(this.password,10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      _id : this._id,
      email : this.email,
      fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,{
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
  )
};

userSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      _id : this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
  )
};

export const User = mongoose.model("User",userSchema);