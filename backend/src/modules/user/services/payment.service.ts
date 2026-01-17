import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createRazorpayOrder = async (
    amount: number,
    receipt: string,
    currency: string = "INR"
) => {
    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts amount in paise
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
};

export const verifyRazorpaySignature = (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
) => {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(text)
        .digest("hex");

    return generated_signature === razorpaySignature;
};

export const getRazorpayKeyId = () => {
    return process.env.RAZORPAY_KEY_ID;
};
