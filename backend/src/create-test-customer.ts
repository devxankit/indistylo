import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Customer from './models/customer.model.js';

dotenv.config();

const createTestCustomer = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const phone = '9999999999';

        let user = await User.findOne({ phone });
        if (user) {
            console.log('Test user already exists');
            return;
        }

        user = await User.create({
            phone,
            email: 'testcustomer@example.com',
            role: 'CUSTOMER',
            password: 'password123'
        });

        const profile = await Customer.create({
            user: user._id,
            name: 'Test Customer',
            email: 'testcustomer@example.com',
            location: '123 Test St, Demo City'
        });

        console.log('✅ Created Test Customer:', (profile as any).name);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

createTestCustomer();
