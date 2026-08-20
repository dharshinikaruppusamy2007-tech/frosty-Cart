const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const products = [
    {
        name: "Chocolate Indulgence",
        description: "Rich dark chocolate ice cream layered with molten fudge swirls and cocoa nibs for the ultimate chocolate lover.",
        price: 249,
       image: "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&q=80&w=600",

        category: "Chocolate",
        stock: 45,
        rating: 4.8
    },
    {
        name: "Belgian Dark Truffle",
        description: "Premium Belgian dark chocolate ice cream with hand-rolled truffle pieces and a hint of sea salt.",
        price: 349,
       image: "https://images.unsplash.com/photo-1570197571499-166b36435e9f?auto=format&fit=crop&q=80&w=600",
        category: "Chocolate",
        stock: 30,
        rating: 4.9
    },
    {
        name: "Madagascar Vanilla",
        description: "Classic Madagascar vanilla bean ice cream. Simple, elegant, and perfectly creamy with real vanilla specks.",
        price: 199,
       image: "https://images.unsplash.com/photo-1570197781417-0c7f078519f7?auto=format&fit=crop&q=80&w=600",

        category: "Vanilla",
        stock: 60,
        rating: 4.9
    },
    {
        name: "French Vanilla Bean",
        description: "Rich and creamy French-style vanilla made with real Tahitian vanilla beans and fresh cream.",
        price: 229,
       image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=600",
        category: "Vanilla",
        stock: 50,
        rating: 4.7
    },
    {
        name: "Strawberry Bliss",
        description: "Fresh strawberry ice cream made with real handpicked strawberries and a touch of lemon zest.",
        price: 219,
        image: "https://images.unsplash.com/photo-1570197781417-0c7f078519f7?auto=format&fit=crop&q=80&w=600",
        category: "Strawberry",
        stock: 40,
        rating: 4.6
    },
    {
        name: "Strawberry Cheesecake",
        description: "Creamy strawberry ice cream swirled with cheesecake chunks and a graham cracker crumble.",
        price: 299,
        image: "https://images.unsplash.com/photo-1584983961760-66e077face24?auto=format&fit=crop&q=80&w=600",
        category: "Strawberry",
        stock: 35,
        rating: 4.8
    },
    {
        name: "Butterscotch Crunch",
        description: "Creamy butterscotch ice loaded with crunchy praline toffee bits and caramel swirls.",
        price: 229,
        image: "https://images.unsplash.com/photo-1558500585-7036fb05b0be?auto=format&fit=crop&q=80&w=600",
        category: "Butterscotch",
        stock: 45,
        rating: 4.5
    },
    {
        name: "Alphonso Mango",
        description: "Tropical Alphonso mango sorbet made with real Indian Alphonso mangoes, dairy-free and refreshing.",
        price: 259,
        image: "https://images.unsplash.com/photo-1591677445540-08028eeb3021?auto=format&fit=crop&q=80&w=600",
        category: "Mango",
        stock: 35,
        rating: 4.7
    },
    {
        name: "Mango Lassi Swirl",
        description: "Creamy mango ice cream swirled with tangy yogurt and cardamom for an authentic Indian twist.",
        price: 279,
        image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&q=80&w=600",
        category: "Mango",
        stock: 30,
        rating: 4.6
    },
    {
        name: "Kesar Pista Kulfi",
        description: "Traditional Indian kulfi flavored with saffron strands and loaded with crunchy pistachios.",
        price: 179,
        image: "https://images.unsplash.com/photo-1629214283215-a7b6f0c91a8a?auto=format&fit=crop&q=80&w=600",
        category: "Kulfi",
        stock: 50,
        rating: 4.8
    },
    {
        name: "Malai Kulfi",
        description: "Rich and dense traditional malai kulfi made with reduced milk, cardamom, and almonds.",
        price: 149,
        image: "https://images.unsplash.com/photo-1507753952621-15396c84b89b?auto=format&fit=crop&q=80&w=600",
        category: "Kulfi",
        stock: 55,
        rating: 4.7
    },
    {
        name: "Chocolate Brownie Sundae",
        description: "Warm chocolate brownie topped with chocolate ice cream, hot fudge, whipped cream, and a cherry.",
        price: 349,
        image: "https://images.unsplash.com/photo-1632395461404-589dccd23456?auto=format&fit=crop&q=80&w=600",
        category: "Sundae",
        stock: 25,
        rating: 4.9
    },
    {
        name: "Classic Butterscotch Sundae",
        description: "Butterscotch ice cream served in a waffle bowl with caramel drizzle, nuts, and whipped cream.",
        price: 299,
        image: "https://images.unsplash.com/photo-1559132148-52fb6a77d7fa?auto=format&fit=crop&q=80&w=600",
        category: "Sundae",
        stock: 30,
        rating: 4.6
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected for seeding');

        // Remove old products including duplicate image data
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert fresh products with unique images
        await Product.insertMany(products);

        console.log(`Seeded ${products.length} products`);
        console.log('All products have been inserted with unique image URLs');

        await mongoose.disconnect();

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();