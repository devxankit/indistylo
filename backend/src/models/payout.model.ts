import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processed", "rejected"],
            default: "pending",
        },
        requestedAt: {
            type: Date,
            default: Date.now,
        },
        processedAt: {
            type: Date,
        },
        transactionId: {
            type: String,
        },
        adminNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
