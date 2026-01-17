import mongoose from "mongoose";

const salonSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Please add a salon name"],
        },
        description: {
            type: String,
        },
        location: {
            type: String,
            required: [true, "Please add a location"],
        },
        geo: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [lng, lat]
                required: true,
            },
        },
        rating: {
            type: Number,
            default: 0,
        },
        images: [String],
        category: [String],
        gender: {
            type: String,
            enum: ["male", "female", "unisex"],
            default: "unisex",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        commissionRate: {
            type: Number,
            default: 15, // Default 15% commission
        },
    },
    {
        timestamps: true,
    }
);

salonSchema.index({ geo: "2dsphere" });
salonSchema.index({ name: "text", description: "text", category: "text" });

const Salon = mongoose.model("Salon", salonSchema);

export default Salon;
