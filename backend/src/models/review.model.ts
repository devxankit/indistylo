import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true, // One review per booking
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
        },
        images: [String],
        reply: {
            text: String,
            createdAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Update salon rating after saving a review
reviewSchema.post("save", async function () {
    const Salon = mongoose.model("Salon");
    const reviews = await (this.constructor as any).find({ salon: this.salon });
    const avgRating =
        reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
        reviews.length;

    await Salon.findByIdAndUpdate(this.salon, { rating: avgRating });
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
