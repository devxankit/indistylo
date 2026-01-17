import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
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
        name: {
            type: String,
            required: [true, "Please add a package name"],
        },
        image: {
            type: String,
            required: [true, "Please add a package image"],
        },
        type: {
            type: String,
            enum: ["at-salon", "at-home", "spa"],
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "unisex"],
            required: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
        },
        services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
            },
        ],
        price: {
            type: Number,
            required: [true, "Please add a package price"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
