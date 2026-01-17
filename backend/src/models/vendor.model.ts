import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        businessName: {
            type: String,
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        pincode: {
            type: String,
            required: false,
        },
        gstNumber: {
            type: String,
            default: "",
        },
        aadharNumber: {
            type: String,
            required: false,
        },
        experience: {
            type: String,
            required: false,
        },
        specialization: {
            type: String,
            required: false,
        },
        verificationDocuments: [
            {
                type: { type: String },
                url: { type: String },
                status: { type: String, default: "pending" },
            },
        ],
        isActive: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["pending", "active", "rejected", "suspended"],
            default: "pending",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        walletBalance: {
            type: Number,
            default: 0,
        },
        commissionRate: {
            type: Number,
            default: 10, // Default 10% commission
        },
        type: {
            type: String,
            enum: ["salon", "freelancer", "spa"],
            default: "salon",
        },
    },
    {
        timestamps: true,
    }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
