import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connect_DB = async () => {
  try {
    const makeConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MONGODB Connected successfully !! through the user : ${makeConnection.connection.host}`);
  } catch (error) {
    console.log(`MONGODB connection failed . The following error has been occured : ${error}`);
  }
};

export {connect_DB};