import mongoose from "mongoose";
import Admin from "./models/admin.model.js";
import dotenv from "dotenv";

dotenv.config();

const resetAdminWallet = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not found in environment variables");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const result = await Admin.updateMany(
            {},
            { $set: { walletBalance: 0 } }
        );

        console.log(`✅ Reset ${result.modifiedCount} admin wallet(s) to ₹0`);
        console.log("Admin wallet balance has been reset successfully!");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting admin wallet:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

resetAdminWallet();
