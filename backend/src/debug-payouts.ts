import mongoose from 'mongoose';

async function debug() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/indistylo');
        console.log('Connected to DB');

        const Vendor = mongoose.model('Vendor', new mongoose.Schema({}));
        const Salon = mongoose.model('Salon', new mongoose.Schema({ vendor: mongoose.Schema.Types.ObjectId }));
        const Payout = mongoose.model('Payout', new mongoose.Schema({ salon: mongoose.Schema.Types.ObjectId, status: String, amount: Number }));
        const Booking = mongoose.model('Booking', new mongoose.Schema({ salon: mongoose.Schema.Types.ObjectId, paymentStatus: String, vendorEarnings: Number }));

        const vendors = await Vendor.find().lean();
        console.log(`Vendors found: ${vendors.length}`);

        for (const v of vendors) {
            console.log(`\nVendor: ${v._id}`);
            const salons = await Salon.find({ vendor: (v as any).user }).lean();
            console.log(`Salons for user ${(v as any).user}: ${salons.length}`);

            for (const s of salons) {
                console.log(`  Salon: ${s._id}`);
                const payouts = await Payout.find({ salon: s._id }).lean();
                console.log(`    Payouts: ${payouts.length}`);
                payouts.forEach(p => console.log(`      - ₹${p.amount} [${p.status}]`));

                const bookings = await Booking.find({ salon: s._id, paymentStatus: 'paid' }).lean();
                const earnings = bookings.reduce((acc, b) => acc + (b.vendorEarnings || 0), 0);
                console.log(`    Earnings: ${earnings}`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
