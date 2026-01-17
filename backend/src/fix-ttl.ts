import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const fixTTLIndex = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/indistylo";
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        if (!db) throw new Error("Database not connected");
        
        console.log("Dropping existing TTL index...");
        try {
            await db.collection("otps").dropIndex("createdAt_1");
            console.log("Dropped 'createdAt_1' index");
        } catch (e: any) {
            console.log("Index might not exist or error dropping:", e.message);
        }

        console.log("The index will be recreated by Mongoose with the new expiry (1800s) on next app start.");
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

fixTTLIndex();
