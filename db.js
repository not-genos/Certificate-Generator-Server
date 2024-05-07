const db = require('mongoose');

const connectDB = async () => {
    console.log('Connecting to MongoDB');
    try {
        await db.connect('mongodb://localhost:27017/certificateGenerator');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

module.exports = connectDB;