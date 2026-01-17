import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "banner",
        "category",
        "referral",
        "promo",
        "settings",
        "deal",
        "featuredService",
        "popularPackage",
        "salonFeaturedService",
      ],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
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

const Content = mongoose.model("Content", contentSchema);

export default Content;
