import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
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
            required: [true, "Please add a service name"],
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, "Please add a price"],
        },
        duration: {
            type: Number, // in minutes
            required: [true, "Please add duration"],
        },
        highlights: [
            {
                type: String,
            },
        ],
        category: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "unisex"],
            default: "unisex",
        },
        image: {
            type: String,
        },
        type: {
            type: String,
            enum: ["at-salon", "at-home", "spa"],
            default: "at-salon",
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

const Service = mongoose.model("Service", serviceSchema);

export default Service;
