import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentGateway: {
            type: String,
            enum: ["razorpay", "stripe", "wallet", "payout"],
            default: "razorpay",
        },
        transactionType: {
            type: String,
            enum: ["credit", "debit"],
            default: "debit",
        },
        gatewayTransactionId: {
            type: String,
        },
        gatewayOrderId: {
            type: String,
        },
        paymentMethod: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
