import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
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
            required: true,
        },
        role: {
            type: String, // e.g., "Senior Stylist", "Junior Stylist"
            default: "Stylist",
        },
        specialization: [String], // ["Haircut", "Coloring"]
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "female",
        },
        address: {
            type: String,
            default: "",
        },
        image: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
