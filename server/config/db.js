const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/daz_learning');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.warn('MongoDB connection error (running in fallback/standalone mode):', err.message);
    }
};

module.exports = connectDB;
