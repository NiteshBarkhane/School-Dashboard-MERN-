import mongoose from "mongoose";

async function connectDb() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected: ", connectionInstance.connection.host);
  } catch (error) {
    console.log("ERROR:connectDb: ", error);
    // throw error;
  }
}

export default connectDb;
