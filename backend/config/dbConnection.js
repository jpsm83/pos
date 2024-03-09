const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;