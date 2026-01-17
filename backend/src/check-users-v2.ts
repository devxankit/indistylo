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

        const users = await User.find({}, { role: 1, phone: 1, email: 1, _id: 1 }).lean();
        console.log(JSON.stringify(users, null, 2));

        console.log(`Total Users: ${users.length}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

checkUsers();
