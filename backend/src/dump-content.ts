import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Content from "./models/content.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const dumpContent = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    const contents = await Content.find({});
    console.log("--- CONTENT COLLECTION DUMP ---");
    console.log(JSON.stringify(contents, null, 2));
    console.log("--- END DUMP ---");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Dump failed:", error);
    process.exit(1);
  }
};

dumpContent();
