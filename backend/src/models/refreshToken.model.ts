import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        tokenHash: {
            type: String,
            required: true,
        },
        deviceInfo: {
            type: String,
            default: "unknown",
        },
        ipAddress: {
            type: String,
            default: "",
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 0 }, // TTL index - auto-delete expired tokens
        },
    },
    { timestamps: true }
);

// Index for token lookup
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

// Static method to revoke all tokens for a user (logout all devices)
refreshTokenSchema.statics.revokeAllForUser = async function (userId: string) {
    return this.updateMany({ userId, isRevoked: false }, { isRevoked: true });
};

// Static method to clean up expired/revoked tokens
refreshTokenSchema.statics.cleanup = async function () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return this.deleteMany({
        $or: [
            { isRevoked: true, updatedAt: { $lt: thirtyDaysAgo } },
            { expiresAt: { $lt: new Date() } },
        ],
    });
};

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
