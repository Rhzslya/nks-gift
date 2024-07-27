import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");

    const connection = mongoose.connection;

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      // Consider handling the error in a production environment
      process.exit(1); // Exit with a failure code
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with a failure code
  }
}
