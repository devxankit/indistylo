import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
        },
        professional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["upcoming", "confirmed", "completed", "cancelled", "missed", "pending"],
            default: "pending",
        },
        type: {
            type: String,
            enum: ["at-salon", "at-home", "spa"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            default: 30
        },
        title: {
            type: String, // Snapshot of Service or Package Name
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        address: {
            type: String,
        },
        geo: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [lng, lat]
            },
        },
        paymentMethod: {
            type: String,
            default: "online"
        },
        notes: {
            type: String,
        },
        commissionAmount: {
            type: Number,
            default: 0,
        },
        vendorEarnings: {
            type: Number,
            default: 0,
        },

    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
