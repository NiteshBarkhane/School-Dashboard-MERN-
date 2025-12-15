import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app.js";
import connectDb from "./db/dbConnection.js";

var PORT = process.env.PORT || 4000;

dotenv.config({
  path: "./.env",
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running at ${process.env.SERVER_URL}`)
    );
  })
  .catch((error) => {
    console.log("Database connection failed!!", error);
  });
