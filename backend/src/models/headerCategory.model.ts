import mongoose from "mongoose";

const headerCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["SALON", "SPA"],
            default: "SALON",
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const HeaderCategory = mongoose.model("HeaderCategory", headerCategorySchema);

export default HeaderCategory;
