import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

console.log("Checking Razorpay Keys...");
if (process.env.RAZORPAY_KEY_ID) {
    console.log("RAZORPAY_KEY_ID is SET");
} else {
    console.log("RAZORPAY_KEY_ID is MISSING");
}

if (process.env.RAZORPAY_KEY_SECRET) {
    console.log("RAZORPAY_KEY_SECRET is SET");
} else {
    console.log("RAZORPAY_KEY_SECRET is MISSING");
}
