import axios from "axios";
import { ApiError } from "./ApiError.js";

async function validateEmailAddress(email) {
  try {
    const accessKey = process.env.MAILBOXLAYER_ACCESS_KEY;
    if (!accessKey) {
      throw new ApiError(500, "MailboxLayer API key not configured.");
    }

    const url = `http://apilayer.net/api/check?access_key=${accessKey}&email=${email}&smtp=1&format=1`;
    const response = await axios.get(url);
    const data = response.data;

    // Allow only Gmail addresses
    if (data.domain.toLowerCase() !== "gmail.com") {
      console.log( "Only Gmail addresses are allowed.");
      throw new ApiError(400, "Only Gmail addresses are allowed.");
    }

    if (!data.format_valid) {
      console.log("Invalid Gmail format.");
      throw new ApiError(400, "Invalid Gmail format.");
    }

    if (!data.mx_found) {
      console.log("Gmail domain cannot receive mail (unexpected).");
      throw new ApiError(404, "Gmail domain cannot receive mail (unexpected).");
    }

    if (!data.smtp_check) {
      console.log("SMTP check failed — Gmail usually blocks this. Assuming valid.");
    }

    return true;
  } catch (error) {
    throw new ApiError(500, "Gmail validation failed: " + error.message);
  }
}

export {validateEmailAddress};
