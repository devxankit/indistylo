import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/indistylo';
  console.log(`Testing connection to: ${uri}`);
  
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Success! MongoDB is running and accessible locally.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error: Could not connect to local MongoDB.');
    console.error('--------------------------------------------------');
    console.error('Common solutions:');
    console.error('1. Make sure MongoDB Community Server is installed.');
    console.error('2. Ensure the "MongoDB" service is running in Windows Services (services.msc).');
    console.error('3. If you use Docker, run: docker run -d -p 27017:27017 --name mongo mongo');
    console.error('--------------------------------------------------');
    process.exit(1);
  }
};

testConnection();

