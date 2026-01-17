import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.model.js';
import Salon from './models/salon.model.js';

dotenv.config();

const checkBookings = async () => {
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
            console.log('❌ Salon not found for this vendor.');
            return;
        }
        console.log(`✅ Salon found: ${salon.name} (ID: ${salon._id})`);

        const bookingsCount = await Booking.countDocuments({ salon: salon._id });
        console.log(`Total Bookings found: ${bookingsCount}`);

        const bookings = await Booking.find({ salon: salon._id }).limit(5);
        bookings.forEach(b => console.log(` - Booking: ${b._id}, Date: ${b.date}`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkBookings();
