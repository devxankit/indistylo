import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/indistylo";
    console.log(`Attempting to connect to MongoDB at: ${uri}`);

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });
  } catch (error) {
    console.error(
      `❌ Error connecting to MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    console.log(
      "Please ensure MongoDB is running locally or check your MONGODB_URI in .env"
    );
    // Don't exit process in development to allow user to fix the URI
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;

