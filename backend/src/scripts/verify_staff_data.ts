
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables manually since we are running a script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import connectDB from "../config/db.js";
import Salon from "../models/salon.model.js";
import Spa from "../models/spa.model.js";
import Staff from "../models/staff.model.js";
import Schedule from "../models/schedule.model.js";
import Service from "../models/service.model.js";
import Vendor from "../models/vendor.model.js";

const run = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        console.log("--- CHEKING LATEST PACKAGE ---");
        // Import Package model
        const Package = (await import("../models/package.model.js")).default;

        // NOW: Populate 'salon' as well, mimicking the controller fix
        const pkg = await Package.findOne({ isActive: true }).sort({ createdAt: -1 }).populate("vendor").populate("salon");

        if (!pkg) {
            console.log("No packages found.");
        } else {
            console.log(`Package: ${pkg.name} (${pkg._id})`);
            console.log(`Vendor: ${(pkg.vendor as any)._id}`);

            // Check if salon is populated
            if (pkg.salon && (pkg.salon as any)._id) {
                console.log(`SUCCESS: Salon populated correctly: ${(pkg.salon as any)._id}`);
                console.log(`Salon Name: ${(pkg.salon as any).name}`);

                // Simulating Frontend: it will use this ID
                const frontendId = (pkg.salon as any)._id.toString();
                console.log(`Frontend would select ID: ${frontendId}`);
            } else {
                console.log(`FAILURE: Salon NOT populated. Raw value: ${pkg.salon}`);
            }

            // The rest of logic remains fetching staff for whatever ID we found...
            const frontendId = pkg.salon && (pkg.salon as any)._id ? (pkg.salon as any)._id.toString() : (pkg.vendor as any)._id.toString();
            console.log(`--- FETCHING STAFF for ID: ${frontendId} ---`);

            // DRY RUN of Controller Logic
            let businessId = frontendId;
            let staff = await Staff.find({ salon: businessId });

            if (staff.length === 0) {
                console.log("Direct lookup failed. Trying Vendor resolution...");
                const resolvedSalon = await Salon.findOne({ vendor: businessId });
                if (resolvedSalon) {
                    console.log(`Resolved to Salon ID: ${resolvedSalon._id}`);
                    staff = await Staff.find({ salon: resolvedSalon._id });
                } else {
                    const resolvedSpa = await Spa.findOne({ vendor: businessId });
                    if (resolvedSpa) {
                        console.log(`Resolved to Spa ID: ${resolvedSpa._id}`);
                        staff = await Staff.find({ salon: resolvedSpa._id });
                    } else {
                        console.log("FAILED: Could not find Salon OR Spa for this vendor.");
                    }
                }
            }

            console.log(`Found ${staff.length} staff members.`);
            staff.forEach(s => console.log(` - ${s.name}`));

            console.log("--- FETCHING SCHEDULE ---");
            let schedules = await Schedule.find({ salon: businessId });
            if (schedules.length === 0) {
                const resolvedSalon = await Salon.findOne({ vendor: businessId });
                if (resolvedSalon) {
                    schedules = await Schedule.find({ salon: resolvedSalon._id });
                }
            }
            console.log(`Found ${schedules.length} schedules.`);


            if (schedules.length === 0) {
                console.log("CRITICAL: No schedules found. This explains why slots are not showing.");

                // Check if *any* schedules exist for *any* salon (just to be sure collection isn't empty)
                const totalSchedules = await Schedule.countDocuments();
                console.log(`Total schedules in DB: ${totalSchedules}`);
            }
        }
    } catch (error) {
        console.error("Error in script:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

run();
