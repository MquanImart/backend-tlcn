import mongoose from 'mongoose';
import { env } from './environment.js';

const uri = `${env.MONGODB_URI}/${env.DATABASE_NAME}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error('Lỗi khi đóng kết nối MongoDB:', error);
        throw error;
    }
};