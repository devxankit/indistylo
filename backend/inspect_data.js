import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
async function inspectData() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env');
        }
        const fs = require('fs');
        const logFile = path.join(process.cwd(), 'debug_output.txt');
        fs.writeFileSync(logFile, ''); // Clear file
        function log(msg) {
            console.log(msg);
            fs.appendFileSync(logFile, msg + '\n');
        }
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to MongoDB');
        // Check Salons
        const salons = await mongoose.connection.db?.collection('salons').find({}).toArray();
        log(`Found ${salons?.length} salons`);
        if (salons && salons.length > 0) {
            salons.forEach(s => log(`Salon: ${s.name} (${s._id})`));
        }
        // Check Staff
        const staff = await mongoose.connection.db?.collection('staffs').find({}).toArray();
        log(`Found ${staff?.length} staff members`);
        if (staff && staff.length > 0) {
            staff.forEach(s => log(`Staff: ${s.name}, SalonRef: ${s.salon}, isActive: ${s.isActive}`));
        }
        // Check Schedules
        const schedules = await mongoose.connection.db?.collection('schedules').find({}).toArray();
        log(`Found ${schedules?.length} schedules`);
        if (schedules && schedules.length > 0) {
            schedules.forEach(s => log(`Schedule: Day ${s.dayOfWeek}, SalonRef: ${s.salon}, Working: ${s.isWorking}`));
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await mongoose.disconnect();
    }
}
inspectData();
//# sourceMappingURL=inspect_data.js.map