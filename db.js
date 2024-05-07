const db = require('mongoose');

const connectDB = async () => {
    console.log('Connecting to MongoDB');
    try {
        await db.connect(`mongodb+srv://ankush:${process.env.MONGO_PASS}@cluster0.rcrjyha.mongodb.net/certificateGenerator`);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

module.exports = connectDB;