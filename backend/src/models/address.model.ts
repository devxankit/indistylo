import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    label: {
        type: String, // Home, Work, etc.
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: String,
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    geo: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: false,
        },
    },
}, {
    timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
