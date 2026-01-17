import mongoose from 'mongoose';
import Salon from './models/salon.model.js';
import Vendor from './models/vendor.model.js';
import Payout from './models/payout.model.js';
import Booking from './models/booking.model.js';

async function debug() {
    await mongoose.connect('mongodb://127.0.0.1:27017/indistylo');
    console.log('Connected to DB');

    const vendors = await Vendor.find().lean();
    console.log(`Found ${vendors.length} vendors`);

    for (const vendor of vendors) {
        console.log(`\nVendor: ${vendor.businessName} (${vendor._id})`);
        console.log(`User: ${vendor.user}`);

        const salon = await Salon.findOne({ vendor: vendor.user }).lean();
        if (salon) {
            console.log(`Salon: ${salon.name} (${salon._id})`);

            const payouts = await Payout.find({ salon: salon._id }).lean();
            console.log(`Payouts count: ${payouts.length}`);
            payouts.forEach(p => console.log(`  - Payout: ₹${p.amount}, Status: ${p.status}, CreatedAt: ${p.createdAt}`));

            const bookings = await Booking.find({ salon: salon._id, paymentStatus: 'paid' }).lean();
            const totalEarnings = bookings.reduce((acc, b) => acc + (b.vendorEarnings || 0), 0);
            console.log(`Total Earnings: ₹${totalEarnings}`);

            const processedPayouts = payouts
                .filter((p: any) => p.status?.toLowerCase() === "processed")
                .reduce((acc, p) => acc + (p.amount || 0), 0);
            const pendingPayout = payouts
                .filter((p: any) => p.status?.toLowerCase() === "pending")
                .reduce((acc, p) => acc + (p.amount || 0), 0);

            console.log(`Processed Payouts (calculated): ₹${processedPayouts}`);
            console.log(`Pending Payouts (calculated): ₹${pendingPayout}`);
            console.log(`Available Balance (calculated): ₹${totalEarnings - processedPayouts - pendingPayout}`);
        } else {
            console.log('No salon found for this vendor user');
        }
    }

    await mongoose.disconnect();
}

debug();
