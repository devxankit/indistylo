import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["BOOKING", "OFFER", "SYSTEM", "POINTS"],
            default: "SYSTEM",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
