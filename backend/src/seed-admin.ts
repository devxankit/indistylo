import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/user.model.js";
import Admin from "./models/admin.model.js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    const adminEmail = "admin@indistylo.com";
    const adminPassword = "12345678";

    // Hash password manually to bypass strict validation in model if necessary
    // Although we will use findOneAndUpdate which bypasses save hooks anyway
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminData = {
      email: adminEmail,
      password: hashedPassword,
      phone: "9999999999",
      role: "ADMIN",
    };

    const user = await User.findOneAndUpdate(
      { phone: adminData.phone },
      { $set: adminData },
      { upsert: true, new: true, runValidators: false }
    );

    if (user) {
      await Admin.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            user: user._id,
            name: "Super Admin",
            email: adminEmail,
            isSuperAdmin: true,
          },
        },
        { upsert: true, new: true }
      );
      console.log("Admin user and profile created/updated successfully.");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
