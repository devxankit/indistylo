import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.model.js';
import Salon from './models/salon.model.js';
import Payout from './models/payout.model.js';

dotenv.config();

const checkStats = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const vendorUserId = '6961232c6482749ad6c5268c';
        const salon = await Salon.findOne({ vendor: vendorUserId });
        if (!salon) {
            console.log('❌ Salon not found');
            return;
        }

        console.log(`Checking Stats for Salon: ${salon.name}`);

        // 1. Fetch Paid Bookings
        const bookings = await Booking.find({ salon: salon._id, paymentStatus: 'paid' });
        console.log(`Paid Bookings: ${bookings.length}`);

        let totalRevenue = 0;
        let totalEarnings = 0;

        bookings.forEach(b => {
            totalRevenue += b.price;
            totalEarnings += (b.vendorEarnings || 0);
        });

        // 2. Fetch Processed Payouts
        const payouts = await Payout.find({ salon: salon._id, status: 'processed' });
        console.log(`Processed Payouts: ${payouts.length}`);

        const totalPayouts = payouts.reduce((acc, p) => acc + p.amount, 0);

        // 3. Calculate Derived Metrics
        const totalCommission = totalRevenue - totalEarnings;
        const walletBalance = totalEarnings - totalPayouts;

        console.log('------------------------------------------------');
        console.log(`Total Revenue: ${totalRevenue}`);
        console.log(`Total Earnings (Lifetime): ${totalEarnings}`);
        console.log(`Total Payouts (Amount Paid): ${totalPayouts}`);
        console.log(`Total Commission (Earned by Admin): ${totalCommission}`);
        console.log(`Wallet Balance (Pending to withdraw): ${walletBalance}`);
        console.log('------------------------------------------------');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkStats();
