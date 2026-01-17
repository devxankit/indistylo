import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            sparse: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        avatar: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        walletBalance: {
            type: Number,
            default: 0,
            min: [0, "Wallet balance cannot be negative"],
        },
        points: {
            type: Number,
            default: 0,
            min: [0, "Points cannot be negative"],
        },
        notes: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "vip"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
