import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin : "http://localhost:5500",
  credentials : true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

//routes import
import userrouter from "./routes/user.route.js";
import { ApiError } from "./utils/ApiError.js";

//routes declaration should be used as middleware using app.use() 
app.use("/api/v1/user",userrouter);

//middleware that sends responce correctly to frontend
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server"
  });
});

export {app};