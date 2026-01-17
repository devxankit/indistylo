import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';

dotenv.config();

const checkUsers = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const allUsers = await User.find({});
        console.log(`Total Users: ${allUsers.length}`);

        const roleCounts: Record<string, number> = {};
        allUsers.forEach(u => {
            const r = u.role || 'undefined';
            roleCounts[r] = (roleCounts[r] || 0) + 1;
        });

        console.log('Role Distribution:', roleCounts);

        const customersLower = await User.find({ role: 'customer' });
        console.log(`Users with role 'customer': ${customersLower.length}`);

        const customersUpper = await User.find({ role: 'CUSTOMER' });
        console.log(`Users with role 'CUSTOMER': ${customersUpper.length}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkUsers();
