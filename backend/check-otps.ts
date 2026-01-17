import mongoose from "mongoose";
import dotenv from "dotenv";
import OTP from "./src/models/otp.model.js";

dotenv.config();

const checkOTPs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/indistylo");
        console.log("Connected to MongoDB");

        const otps = await OTP.find({});
        console.log(`Found ${otps.length} OTP records:`);
        otps.forEach(otp => {
            console.log(`- Phone: ${otp.phone}, CreatedAt: ${otp.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkOTPs();
