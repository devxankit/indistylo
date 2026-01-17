import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Import Models
import Salon from './src/models/salon.model.js';
import Schedule from './src/models/schedule.model.js';
import Spa from './src/models/spa.model.js';
import Staff from './src/models/staff.model.js';
console.log('CWD:', process.cwd());
dotenv.config(); // Try default first
if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    // Try explicit path
    dotenv.config({ path: path.join(process.cwd(), '.env') });
}
const TARGET_ID = '69647ec7658f9dfe76df65e6';
const LOG_FILE = path.join(process.cwd(), 'salon_check_output.txt');
// Ensure log file empty
fs.writeFileSync(LOG_FILE, '');
function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}
async function checkSpecificSalon() {
    try {
        if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
            throw new Error('MONGO/MONGODB_URI not found in .env');
        }
        const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || "";
        await mongoose.connect(dbUri);
        log('Connected to MongoDB');
        log(`Checking Salon ID: ${TARGET_ID}`);
        // 1. Check Salon Existence
        let salon = await Salon.findById(TARGET_ID);
        if (!salon) {
            let spa = await Spa.findById(TARGET_ID);
            if (spa) {
                log(`Spa FOUND: ${spa.name} (Type: Spa)`);
            }
            else {
                log('NOT FOUND in Salons or Spas collection. This ID appears to be missing from the database, but we will seed Schedule/Staff for it anyway.');
            }
        }
        else {
            log(`Salon FOUND: ${salon.name} (Active: ${salon.isActive})`);
        }
        // 2. Check and Seed Schedule
        const schedule = await Schedule.find({ salon: TARGET_ID });
        log(`Schedules found: ${schedule.length}`);
        if (schedule.length === 0) {
            log('Creating Default Schedule...');
            const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const scheduleDocs = DAYS.map((dayName, index) => ({
                salon: TARGET_ID,
                dayOfWeek: index,
                dayName: dayName,
                isWorking: true,
                startTime: "09:00",
                endTime: "20:00",
                breaks: []
            }));
            await Schedule.insertMany(scheduleDocs);
            log('Created 7-day schedule for TARGET_ID.');
        }
        else {
            schedule.forEach(s => log(` - Day ${s.dayOfWeek}: Working=${s.isWorking}`));
        }
        // 3. Check and Seed Staff
        const staff = await Staff.find({ salon: TARGET_ID });
        log(`Staff found: ${staff.length}`);
        if (staff.length === 0) {
            log('Creating Default Staff...');
            const newStaff = new Staff({
                salon: TARGET_ID,
                onModel: 'Salon',
                name: "IndiStylo Professional",
                role: "Senior Provider",
                specialization: ["General Services", "Home Services"],
                gender: "female",
                isActive: true,
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            });
            await newStaff.save();
            log('Created default staff member for TARGET_ID.');
        }
        else {
            staff.forEach(s => log(` - Staff: ${s.name} (Active: ${s.isActive})`));
        }
    }
    catch (error) {
        log(`Error: ${error}`);
    }
    finally {
        await mongoose.disconnect();
    }
}
checkSpecificSalon();
//# sourceMappingURL=check_specific_salon.js.map