import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/service.model.js';
import Salon from './models/salon.model.js';
// Assuming Package model exists, if not I'll find out from list_dir
import Package from './models/package.model.js';

dotenv.config();

const checkData = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const vendorUserId = '6961232c6482749ad6c5268c';
        console.log(`Checking data for Vendor User ID: ${vendorUserId}`);

        const salon = await Salon.findOne({ vendor: vendorUserId });
        if (!salon) {
            console.log('❌ Salon not found for this vendor.');
            return;
        }
        console.log(`✅ Salon found: ${salon.name} (ID: ${salon._id})`);

        const services = await Service.find({ salon: salon._id });
        console.log(`Services found: ${services.length}`);
        services.forEach(s => console.log(` - ${s.name} (${s.price})`));

        // Check Packages
        try {
            // Assuming schema has salon field
            const packages = await Package.find({ salon: salon._id });
            console.log(`Packages found: ${packages.length}`);
            packages.forEach(p => console.log(` - ${p.name} (${p.price})`));
        } catch (e) {
            console.log('Error querying packages (maybe model/schema issue):', e.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkData();
