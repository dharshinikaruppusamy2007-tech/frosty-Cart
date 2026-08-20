const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for admin seeding');

        const adminEmail = 'admin@frostycart.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Existing user updated to admin role');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);

            await User.create({
                name: 'Admin',
                email: adminEmail,
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created');
        }

        const defaultCategories = [
            { name: 'Chocolate', description: 'Rich chocolate flavored ice creams' },
            { name: 'Vanilla', description: 'Classic vanilla flavored ice creams' },
            { name: 'Strawberry', description: 'Fresh strawberry flavored ice creams' },
            { name: 'Butterscotch', description: 'Creamy butterscotch flavored ice creams' },
            { name: 'Mango', description: 'Tropical mango flavored ice creams' },
            { name: 'Kulfi', description: 'Traditional Indian kulfi' },
            { name: 'Sundae', description: 'Delicious ice cream sundaes' }
        ];

        for (const cat of defaultCategories) {
            await Category.findOneAndUpdate(
                { name: cat.name },
                cat,
                { upsert: true, new: true }
            );
        }
        console.log('Default categories seeded');

        await mongoose.disconnect();
        console.log('Admin seeding completed');
    } catch (error) {
        console.error('Admin seed error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
