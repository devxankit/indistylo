import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        headerCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HeaderCategory",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["SALON", "SPA"],
            default: "SALON",
        },
        gender: {
            type: String,
            required: true,
            enum: ["MALE", "FEMALE"],
        },
        image: {
            type: String,
            required: true,
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

// Index for efficient querying by gender, header category and type
subcategorySchema.index({ headerCategoryId: 1, gender: 1, type: 1 });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;
