import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const checkIndexes = async () => {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/indistylo";
    console.log("Connecting to:", uri);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    const indexes = await db.collection("otps").indexes();
    console.log(
      "Indexes on 'otps' collection:",
      JSON.stringify(indexes, null, 2)
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

checkIndexes();
