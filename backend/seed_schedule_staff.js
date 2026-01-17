import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
// Fix for ESM __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Import Models
// Note: Using relative paths assuming this file is in backend root
// We need to import the models directly or define minimal schemas if imports fail due to path issues
// Let's try importing via relative paths first.
import Salon from './src/models/salon.model.js';
import Spa from './src/models/spa.model.js';
import Staff from './src/models/staff.model.js';
import Schedule from './src/models/schedule.model.js';
dotenv.config({ path: path.join(process.cwd(), '.env') });
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
async function seedData() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        // 1. Fetch all Salons and Spas
        const salons = await Salon.find({});
        const spas = await Spa.find({});
        const allBusinesses = [
            ...salons.map(s => ({ ...s.toObject(), type: 'Salon' })),
            ...spas.map(s => ({ ...s.toObject(), type: 'Spa' }))
        ];
        console.log(`Found ${salons.length} Salons and ${spas.length} Spas.`);
        for (const business of allBusinesses) {
            const businessId = business._id;
            const businessName = business.name;
            const businessType = business.type;
            console.log(`Processing ${businessType}: ${businessName} (${businessId})`);
            // --- SEED SCHEDULE ---
            const existingSchedule = await Schedule.findOne({ salon: businessId });
            if (!existingSchedule) {
                console.log(`  - No schedule found. Creating default schedule...`);
                const scheduleDocs = DAYS.map((dayName, index) => ({
                    salon: businessId,
                    dayOfWeek: index,
                    dayName: dayName,
                    isWorking: true, // Default to open 7 days
                    startTime: "09:00",
                    endTime: "20:00",
                    breaks: []
                }));
                await Schedule.insertMany(scheduleDocs);
                console.log(`  - Created 7-day schedule.`);
            }
            else {
                console.log(`  - Schedule exists.`);
            }
            // --- SEED STAFF ---
            const existingStaff = await Staff.findOne({ salon: businessId });
            if (!existingStaff) {
                console.log(`  - No staff found. Creating default staff...`);
                const newStaff = new Staff({
                    salon: businessId,
                    onModel: businessType, // 'Salon' or 'Spa'
                    name: "Demo Professional",
                    role: "Senior Provider",
                    specialization: ["General Services"],
                    gender: "female",
                    isActive: true,
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                });
                await newStaff.save();
                console.log(`  - Created default staff member.`);
            }
            else {
                // Check if active
                if (!existingStaff.isActive) {
                    existingStaff.isActive = true;
                    await existingStaff.save();
                    console.log(`  - Activated existing staff member.`);
                }
                else {
                    console.log(`  - Active staff member exists.`);
                }
            }
        }
        console.log('--- Seeding Completed ---');
    }
    catch (error) {
        console.error('Seeding Error:', error);
    }
    finally {
        await mongoose.disconnect();
    }
}
seedData();
//# sourceMappingURL=seed_schedule_staff.js.map