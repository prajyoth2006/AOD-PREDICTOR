import dotenv from "dotenv";
import {connect_DB} from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
  path : './env'
});

connect_DB()
.then(() => {
  app.listen(process.env.PORT,() => {
    console.log(`app is listening to the port ${process.env.PORT}`);
  });

  app.on("error",(error) => {
    console.log(`connection cannot be established to the mongodb ${error}`);
  });
})
.catch((err) => {
  console.log(`MONGODB CONNECTION ERROR HAS BEEN OCCURED !! The following error has been occured ${err}`);
});