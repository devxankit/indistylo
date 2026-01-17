import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salon: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel'
        },
        onModel: {
            type: String,
            required: true,
            enum: ['Salon', 'Spa'],
            default: 'Salon'
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        items: [
            {
                name: { type: String },
                type: { type: String, enum: ['service', 'package'] },
                price: { type: Number },
                quantity: { type: Number, default: 1 }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ["online", "cash", "wallet", "salon"],
            default: "online",
        },
        razorpayOrderId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
