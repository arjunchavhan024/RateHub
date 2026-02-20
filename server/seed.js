const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@ratehub.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit();
        }

        const admin = new User({
            name: 'System Administrator Account',
            email: adminEmail,
            password: 'AdminPassword123!',
            address: 'RateHub Headquarters, Tech City',
            role: 'System Administrator'
        });

        await admin.save();
        console.log('Initial Admin User Created Successfully!');
        console.log('Email: admin@ratehub.com');
        console.log('Password: AdminPassword123!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
