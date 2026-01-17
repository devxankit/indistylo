import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/indistylo");
        console.log("Connected to MongoDB");
        const db = mongoose.connection.db;
        const collection = db.collection("otps");
        const indexes = await collection.indexes();
        console.log("Indexes for 'otps' collection:");
        console.log(JSON.stringify(indexes, null, 2));
        await mongoose.disconnect();
    }
    catch (error) {
        console.error("Error:", error);
    }
};
checkIndexes();
//# sourceMappingURL=check-indexes.js.map