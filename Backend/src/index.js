import dotenv from "dotenv";
import { connect_DB } from "./db/index.js";
import { app } from "./app.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 8000;

connect_DB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });

    app.on("error", (error) => {
      console.log(`Server error: ${error}`);
    });
  })
  .catch((err) => {
    console.log(`MONGODB CONNECTION ERROR: ${err}`);
  });
